import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import farmaciaImg from "./Tudo/farmacia.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba.png";
import barra1Img from "./Tudo/barra1.png";
import barra2Img from "./Tudo/barra2.png";
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

export function Farmacia() {
  const navigate = useNavigate();
  const [elementosData, setElementosData] = useState([]);
  const [error, setError] = useState("");
  const [updatingIds, setUpdatingIds] = useState(new Set());


  useEffect(() => {
    api.get("/farmacia", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(response => {
      const data = response.data;
      console.log(data)
      if (Array.isArray(data)) {
        const mapped = data.map(item => {
          const key = item.nomePadronizado;
          let coordsPx = { x: 0, y: 0, w: 0, h: 0 };
          try {
            const p = JSON.parse(item.posicaoNoLayout || '{}');
            if (["x","y","w","h"].every(k => typeof p[k] === 'number')) {
              coordsPx = { x: p.x, y: p.y, w: p.w, h: p.h };
            }
          } catch {}
          const selectImage = () => {
            const lower = key.toLowerCase();
            for (const [prefix,img] of Object.entries(prefixImageMap)) {
              if (lower.startsWith(prefix.toLowerCase())) return img;
            }
            return item.tipo && tipoImageMap[item.tipo] ? tipoImageMap[item.tipo] : null;
          };
          const sl = (item.status||"").toLowerCase();
          return {
            id: item.id,
            label: key,
            nome:item.nome,
            coordsPx,
            img: selectImage(),
            statusLocal: STATUSES.includes(sl) ? sl : STATUSES[0],
            original: item,
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

  useEffect(() => {
    let isMounted = true;
    async function connectModbus() {
      try {
        await modbusApi.post("/connect", {
          host: "192.168.1.11",
          port: 502,
          slaveId: 1
        });
      } catch (e) {
        console.error("Erro conexão Modbus:", e);
        setError("Não foi possível conectar ao Modbus");
      }
    }
    connectModbus();

    return () => {
      // ao desmontar, fecha conexão Modbus
      modbusApi.post("/close").catch(err => {
        console.warn("Erro ao fechar Modbus:", err);
      });
    };
  }, []);

      // 3) Lê status via Modbus após ter elementos
  useEffect(() => {
    if (!elementosData.length) return;
    async function fetchStatuses() {
      try {
        const res = await modbusApi.post("/read", {
          type: "holding",
          address: 0,
          length: 100
        });
        const regs = res.data.data;
        setElementosData(prev => prev.map((el, idx) => {
          const code = regs[idx];
          return { ...el, statusLocal: STATUSES[code] || STATUSES[0] };
        }));
      } catch (e) {
        console.error("Erro ao ler status Modbus:", e);
        setError("Falha ao ler status dos equipamentos");
      }
    }
    fetchStatuses();
  }, [elementosData]);

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

  const toPct = (px,total) => `${(px/total)*100}%`;

  return (
    <div className="relative top-20 w-full max-w-xl" style={{ transform:'scale(1.6)' ,aspectRatio:`${ORIGINAL_WIDTH}/${ORIGINAL_HEIGHT}` }}>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <img src={farmaciaImg} alt="Diagrama Farmácia" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} />

      {elementosData.map(el => {
        // Skip specific elements
        const { x,y,w,h } = el.coordsPx;
        if (!el.img || w===0 || h===0) return null;
        const isUpdating = updatingIds.has(el.id);
        const labelTop = y + 32;
        if (["Nivel_ta","Nivel_tm"].includes(el.label)) return (
        <div
          key={el.label}
          className="flex flex-col items-center"
          style={{
            position: "absolute",
            left: toPct(x, ORIGINAL_WIDTH),
            top: toPct(y, ORIGINAL_HEIGHT),
            width: toPct(w, ORIGINAL_WIDTH),
            height: toPct(h, ORIGINAL_HEIGHT),
          }}
        >
          {/* Track */}
          <div
            className="relative bg-gray-200 rounded-sm w-8 mr-2 h-full"
          >
            {/* Fill */}
            <div
              className="absolute bottom-0 bg-blue-400 rounded-t-sm"
              style={{
                width: "100%",
                height: `${20}%`, 
              }}
            />

            {/* Marker */}
            <div
              className="absolute"
              style={{
                bottom: `calc(${20}% - 0.5rem)`,  // 0.5rem = metade da altura do marker
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="w-8 h-2 bg-gray-400 rounded-sm" />
            </div>
          </div>
            
          {/* Label abaixo */}
          <span className="absolute mr-2 text-sm font-medium text-gray-700">
            {20}L
          </span>
        </div>
        );
        return (
          <>
            <div className={el.original.nomePadronizado.includes("bomba") ? "mx-24 my-4":"mx-9"} key={`${el.id}-label`} aria-hidden style={{
              position:'absolute',
              left: toPct(x, ORIGINAL_WIDTH),
              top: toPct(labelTop, ORIGINAL_HEIGHT),
              transform:'translateY(-100%)',
              padding:'2px 4px',
              color:'yellow',
              backgroundColor:'black',
              borderRadius:'4px',
              fontSize:'1rem',
              whiteSpace:'nowrap',
              pointerEvents:'none'
            }}>
            {el.nome}
            </div>
            <button key={el.id} onClick={() => !isUpdating && handleToggle(el)} aria-label={`${el.nome} está ${el.statusLocal}`} disabled={isUpdating} style={{
              position:'absolute',
              left: toPct(x,ORIGINAL_WIDTH),
              top: toPct(y,ORIGINAL_HEIGHT),
              width: toPct(w,ORIGINAL_WIDTH),
              height: toPct(h,ORIGINAL_HEIGHT),
              padding:0,margin:0, cursor:isUpdating?'wait':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', opacity:isUpdating?0.6:1
            }}>
              <img src={el.img} alt={el.nome} style={{ width:'100%',height:'100%',objectFit:'contain', pointerEvents:'none', filter:filters[el.statusLocal]||'none', transition:'filter 0.3s' }} />
            </button>
          </>
        );
      })}
    </div>
  );
}
