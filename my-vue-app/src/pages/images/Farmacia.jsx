import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import api from "../../api";
import farmaciaImg from "./Tudo/farmacia.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba.png";
import barra1Img from "./Tudo/barra1.png";
import barra2Img from "./Tudo/barra2.png";
import barra3Img from "./Tudo/barra3.png";
import modbusApi from "../../modbusApi";

const ORIGINAL_WIDTH = 591;
const ORIGINAL_HEIGHT = 435;

const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)",
  manutencao: "grayscale(1) sepia(1) saturate(8) hue-rotate(0deg) brightness(1.2) contrast(1.2)",
  estragado:  "grayscale(1) brightness(0.2)",
};

const prefixImageMap = {
  "valvula1":  valvula1Img,
  "valvula2":  valvula2Img,
  "sensor1":   sensor1Img,
  "sensor2":   sensor2Img,
  "bomba":     bombaImg,
  "nivel_ta":  barra1Img,
  "nivel_tm":  barra2Img,
  "pressao_ba":barra3Img,
};

const tipoImageMap = {
  VALVULA:          valvula1Img,
  SENSOR:           sensor1Img,
  BOMBA:            bombaImg,
  INDICADOR_VOLUME: barra1Img,
};

export function Farmacia() {
  const navigate = useNavigate();
  const [elementosData, setElementosData] = useState([]);
  const [error, setError] = useState("");
  const [updatingIds, setUpdatingIds] = useState(new Set());

  // Fetch layout and status initial
  useEffect(() => {
    api.get("/farmacia", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(response => {
      const data = response.data;
      if (Array.isArray(data)) {
        const mapped = data.map(item => {
          const key = item.nomePadronizado;
          let coordsPx = { x: 0, y: 0, w: 0, h: 0 };
          try {
            const p = JSON.parse(item.posicaoNoLayout || "{}");
            if (["x","y","w","h"].every(k => typeof p[k] === 'number')) {
              coordsPx = { x: p.x, y: p.y, w: p.w, h: p.h };
            }
          } catch {}
          const selectImage = () => {
            const lower = key.toLowerCase();
            for (const [prefix, img] of Object.entries(prefixImageMap)) {
              if (lower.startsWith(prefix.toLowerCase())) return img;
            }
            return item.tipo && tipoImageMap[item.tipo]
              ? tipoImageMap[item.tipo]
              : null;
          };
          const sl = (item.status || "").toLowerCase();
          return {
            id:           item.id,
            label:        key,
            nome:         item.nome,
            coordsPx,
            img:          selectImage(),
            statusLocal:  STATUSES.includes(sl) ? sl : STATUSES[0],
            value:        0,
            clpAddress:   Number(item.pontoControle.enderecoCLP),
            original:     item,
          };
        });
        setElementosData(mapped);
      } else {
        setElementosData([]);
      }
    })
    .catch(err => {
      if (err.response?.status === 401) navigate('/');
      setError("Não foi possível carregar os dados");
      setElementosData([]);
    });
  }, [navigate]);

  // Connect Modbus on mount
  useEffect(() => {
    modbusApi.post("/connect", {
      host: "192.168.1.33",
      port: 502,
      slaveId: 1
    }).catch(e => {
      console.error("Erro conexão Modbus:", e);
      setError("Não foi possível conectar ao Modbus");
    });
    return () => {
      modbusApi.post("/close").catch(err => console.warn("Erro ao fechar Modbus:", err));
    };
  }, []);

  // Polling periódico de status e níveis
  useEffect(() => {
    if (!elementosData.length) return;
    async function fetchStatuses() {
      try {
        const addresses = elementosData.map(el => el.clpAddress - 1);
        const minAddr = Math.min(...addresses);
        const maxAddr = Math.max(...addresses);
        const length = maxAddr - minAddr + 1;

        const res = await modbusApi.post(
          "/read",
          { type: "holding", address: minAddr, length },
          { timeout: 2000 }
        );
        const regs = res.data.data;

        const nivelRes = await modbusApi.post("/read", {
          type: "holding",
          address: 114,
          length: 2
        });
        const [taLevel, tmLevel] = nivelRes.data.data;

        setElementosData(prev =>
          prev.map(el => {
            const idx = el.clpAddress - minAddr;
            const newStatus = STATUSES[regs[idx]] || el.statusLocal;
            let newValue = el.value;
            if (el.label.toLowerCase() === "nivel_ta") newValue = taLevel;
            if (el.label.toLowerCase() === "nivel_tm") newValue = tmLevel;
            return { ...el, statusLocal: newStatus, value: newValue };
          })
        );
      } catch (e) {
        console.error("Erro ao ler status Modbus:", e);
        setError("Falha ao ler status dos equipamentos");
      }
    }
    fetchStatuses();
  }, [elementosData]);

  // Toggle status only for válvulas
  const handleToggle = async el => {
    const nextIdx = (STATUSES.indexOf(el.statusLocal) + 1) % STATUSES.length;
    const next = STATUSES[nextIdx];
    setElementosData(prev => prev.map(e =>
      e.id === el.id ? { ...e, statusLocal: next } : e
    ));
    setUpdatingIds(prev => new Set(prev).add(el.id));

    try {
      await modbusApi.post("/write", {
        type: "holding",
        address: el.original.pontoControle.enderecoCLP,
        value: nextIdx
      });
      setError("");
    } catch {
      setError(`Falha ao atualizar ${el.label}.`);
      // reverte
      setElementosData(prev => prev.map(e =>
        e.id === el.id ? { ...e, statusLocal: el.statusLocal } : e
      ));
    } finally {
      setUpdatingIds(prev => { prev.delete(el.id); return new Set(prev); });
    }
  };

  const toPct = (px, total) => `${(px / total) * 100}%`;
  const nivel = localStorage.getItem('nivel')
  console.log

  return (
    <div
      className="relative top-20 w-full max-w-xl"
      style={{
        transform: 'scale(1.5)',
        aspectRatio: `${ORIGINAL_WIDTH}/${ORIGINAL_HEIGHT}`
      }}
    >
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <img
        src={farmaciaImg}
        alt="Diagrama Farmácia"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {elementosData.map(el => {
        const { x, y, w, h, value } = el.coordsPx;
        if (!el.img || w === 0 || h === 0) return null;

        const left     = toPct(x, ORIGINAL_WIDTH);
        const top      = toPct(y, ORIGINAL_HEIGHT);
        const width    = toPct(w, ORIGINAL_WIDTH);
        const height   = toPct(h, ORIGINAL_HEIGHT);
        const labelTop = toPct(y + 32, ORIGINAL_HEIGHT);
        const isUpdating = updatingIds.has(el.id);

        // indicadores de nível
        if (['nivel_ta', 'nivel_tm'].includes(el.label.toLowerCase())) {
          return (
            <div
              key={el.label}
              className="flex flex-col items-center"
              style={{
                position: 'absolute',
                left, top, width, height
              }}
            >
              <div className="relative bg-gray-200 rounded-sm w-8 h-full">
                <div
                  className="absolute bottom-0 bg-blue-400 rounded-t-sm"
                  style={{ width: '100%', height: `${value}%` }}
                />
                <div
                  className="absolute"
                  style={{
                    bottom: `calc(${value}% - 0.5rem)`,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="w-8 h-2 bg-gray-400 rounded-sm" />
                </div>
              </div>
              <span className="absolute mt-1 text-sm font-medium text-gray-700">
                {value}L
              </span>
            </div>
          );
        }

        // somente válvula recebe <button>, demais apenas <img>
        const isButton = el.original.tipo === "VALVULA" || el.original.tipo === "BOMBA";

        return (
          <React.Fragment key={el.id}>
            {/* label mantida exatamente como antes */}
            <div
              key={`${el.id}-label`}
              className={el.original.nomePadronizado.includes('bomba') ? 'mx-24 my-4' : 'mx-9'}
              aria-hidden
              style={{
                position: 'absolute',
                left,
                top: labelTop,
                transform: 'translateY(-100%)',
                padding: '2px 4px',
                color: 'yellow',
                backgroundColor: 'black',
                borderRadius: '4px',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}
            >
              {el.nome}
            </div>

            {isButton ? (
              nivel == "ADMIN" || nivel == "MANUTENCAO" ?
              <button
                onClick={() => !isUpdating && handleToggle(el)}
                aria-label={`${el.nome} está ${el.statusLocal}`}
                disabled={isUpdating}
                style={{
                  position: 'absolute',
                  left, top, width, height,
                  padding: 0,
                  margin: 0,
                  cursor: isUpdating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isUpdating ? 0.6 : 1
                }}
              >
                <img
                  src={el.img}
                  alt={el.nome}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: filters[el.statusLocal],
                    transition: 'filter 0.3s',
                    pointerEvents: 'none'
                  }}
                />
              </button>
          : (
              <div
                aria-label={`${el.nome} está ${el.statusLocal}`}
                disabled={isUpdating}
                style={{
                  position: 'absolute',
                  left, top, width, height,
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isUpdating ? 0.6 : 1
                }}
              >
                <img
                  src={el.img}
                  alt={el.nome}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: filters[el.statusLocal],
                    transition: 'filter 0.3s',
                    pointerEvents: 'none'
                  }}
                />
              </div>
          )) : (
              <img
                src={el.img}
                alt={el.nome}
                style={{
                  position: 'absolute',
                  left, top, width, height,
                  objectFit: 'contain',
                  filter: filters[el.statusLocal],
                  transition: 'filter 0.3s',
                  pointerEvents: 'none'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
