import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";           // Backend API para dados não relacionados a Modbus
import modbusApi from "../../modbusApi"; // API para Modbus
import distribuicaoImg from "./Tudo/distribuicao.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba2.png";
import barra1Img from "./Tudo/barra1.png";
import barra2Img from "./Tudo/barra2.png";

const ORIGINAL_WIDTH = 520;
const ORIGINAL_HEIGHT = 400;

const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(0.7) saturate(8) hue-rotate(90deg) brightness(0.9)",
  manutencao: "grayscale(1) sepia(1) saturate(5) hue-rotate(0deg) brightness(1.2) contrast(1)",
  estragado:  "grayscale(1) brightness(0.2)",
};

const prefixImageMap = {
  "valvula1": valvula1Img,
  "valvula2": valvula2Img,
  "sensor1":  sensor1Img,
  "sensor2":  sensor2Img,
  "bomba":    bombaImg,
  "nivel_ta": barra1Img,
  "nivel_tm": barra2Img,
};

const tipoImageMap = {
  VALVULA: valvula1Img,
  SENSOR:  sensor1Img,
  BOMBA:   bombaImg,
  INDICADOR_VOLUME: barra1Img,
};

export function Distribuicao() {
  const navigate = useNavigate();
  const [elementosData, setElementosData] = useState([]);
  const [error, setError] = useState("");
  const [updatingIds, setUpdatingIds] = useState(new Set());

  // 1) Carrega layout e posições do banco de dados
  useEffect(() => {
    api.get("/distribuicao", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(({ data }) => {
      if (!Array.isArray(data)) return setElementosData([]);

      const mapped = data.map(item => {
        let coordsPx = { x: 0, y: 0, w: 0, h: 0 };
        try {
          const p = JSON.parse(item.posicaoNoLayout || '{}');
          if (["x","y","w","h"].every(k => typeof p[k] === 'number')) coordsPx = p;
        } catch {}

        const lower = item.nomePadronizado.toLowerCase();
        const selectImage = () => {
          for (const [prefix, img] of Object.entries(prefixImageMap)) {
            if (lower.startsWith(prefix)) return img;
          }
          return tipoImageMap[item.tipo] ?? null;
        };

        return {
          id: item.id,
          key: item.nomePadronizado,
          label: item.nomePadronizado,
          coordsPx,
          nome: item.nome,
          img: selectImage(),
          statusLocal: STATUSES[0], // inicializa como 'desligado'
          original: item,
        };
      });

      setElementosData(mapped);
    })
    .catch(err => {
      if (err.response?.status === 401) navigate('/');
      setError("Não foi possível carregar os dados de distribuição");
      setElementosData([]);
    });
  }, [navigate]);

  // 2) Conecta ao Modbus ao montar e fecha ao desmontar
  useEffect(() => {
    async function connectModbus() {
      try {
        await modbusApi.post("/connect", {
          host: "127.0.0.1/8",
          port: 502,
          slaveId: 1
        });
      } catch (e) {
        console.error("Erro conexão Modbus:", e);
        setError("Não foi possível conectar ao Modbus");
      }
    }
    connectModbus();
    return () => { modbusApi.post("/close").catch(() => {}); };
  }, []);

  // 3) Lê status via Modbus após carregar elementos
  useEffect(() => {
    if (!elementosData.length) return;
    async function fetchStatuses() {
      try {
        const res = await modbusApi.post("/read", {
          type: "holding",
          address: 0,
          length: elementosData.length
        });
        const regs = res.data.data;
        setElementosData(prev => prev.map((el, idx) => {
          const code = regs[idx] ?? 0;
          return { ...el, statusLocal: STATUSES[code] || STATUSES[0] };
        }));
      } catch (e) {
        console.error("Erro ao ler status Modbus:", e);
        setError("Falha ao ler status dos equipamentos");
      }
    }
    fetchStatuses();
  }, [elementosData]);

  // 4) Alterna status local e escreve Modbus
  const handleToggle = async (el) => {
    const { id, label, statusLocal } = el;
    const nextIdx = (STATUSES.indexOf(statusLocal) + 1) % STATUSES.length;
    const next = STATUSES[nextIdx];
    setElementosData(prev => prev.map(e => e.id===id?{...e, statusLocal:next}:e));
    setUpdatingIds(prev => new Set(prev).add(id));
    try {
      await modbusApi.post("/write", {
        type: "holding",
        address: elementosData.findIndex(e => e.id===id),
        value: nextIdx
      });
      setError("");
    } catch {
      setError(`Falha ao atualizar ${label}.`);
      setElementosData(prev => prev.map(e => e.id===id?{...e, statusLocal}:e));
    } finally {
      setUpdatingIds(prev => { prev.delete(id); return new Set(prev); });
    }
  };

  const toPct = (px, total) => `${(px/total)*100}%`;

  return (
    <div className="relative top-20 w-full max-w-xl" style={{ transform:'scale(1.5)', aspectRatio:`${ORIGINAL_WIDTH}/${ORIGINAL_HEIGHT}` }}>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <img
        src={distribuicaoImg}
        alt="Diagrama Distribuição"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
      />
      {elementosData.map(el => {
        const { x, y, w, h } = el.coordsPx;
        if (!el.img || w === 0 || h === 0) return null;
        const isUpdating = updatingIds.has(el.id);
        const labelTop = y + 30;
        return (
          <>
            <div
              className={el.original.nomePadronizado.includes("bomba") ? "mx-24 my-4":"mx-9"}
              key={`${el.id}-label`}
              aria-hidden
              style={{
                position: 'absolute',
                left:   toPct(x, ORIGINAL_WIDTH),
                top:    toPct(labelTop, ORIGINAL_HEIGHT),
                transform: 'translateY(-100%)',
                padding: '2px 4px',
                backgroundColor: 'black',
                color: 'yellow',
                borderRadius: '4px',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}
            >
              {el.nome}
            </div>
            <button
              key={el.id}
              onClick={() => !isUpdating && handleToggle(el)}
              aria-label={`${el.label} está ${el.statusLocal}`}
              disabled={isUpdating}
              style={{
                position: 'absolute',
                left:   toPct(x, ORIGINAL_WIDTH),
                top:    toPct(y, ORIGINAL_HEIGHT),
                width:  toPct(w, ORIGINAL_WIDTH),
                height: toPct(h, ORIGINAL_HEIGHT),
                padding: 0,
                margin:  0,
                cursor:  isUpdating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isUpdating ? 0.6 : 1
              }}
            >
              <img
                src={el.img}
                alt={el.label}
                style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none', filter: filters[el.statusLocal], transition: 'filter 0.3s' }}
              />
            </button>
          </>
        );
      })}
    </div>
  );
}
