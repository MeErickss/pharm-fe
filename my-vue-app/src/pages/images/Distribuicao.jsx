import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

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

// Ciclo de status local (lowercase)
const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

// Filtros CSS mapeados
const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(0.7) saturate(8) hue-rotate(90deg) brightness(0.9)",
  manutencao: "grayscale(1) sepia(1) saturate(5) hue-rotate(0deg) brightness(1.2) contrast(1)",
  estragado:  "grayscale(1) brightness(0.2)",
};

// Mapeamento de prefixos de nomePadronizado para imagem
const prefixImageMap = {
  "valvula1": valvula1Img,
  "valvula2": valvula2Img,
  "sensor1":  sensor1Img,
  "sensor2":  sensor2Img,
  "bomba":    bombaImg,
  "nivel_ta": barra1Img,
  "nivel_tm": barra2Img,
};

// Fallback por tipo
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
          if (["x","y","w","h"].every(k => typeof p[k] === 'number')) {
            coordsPx = p;
          }
        } catch {}

        const lower = item.nomePadronizado.toLowerCase();
        const selectImage = () => {
          for (const [prefix, img] of Object.entries(prefixImageMap)) {
            if (lower.startsWith(prefix)) return img;
          }
          return tipoImageMap[item.tipo] ?? null;
        };

        const sl = (item.status || '').toLowerCase();
        const initialStatus = STATUSES.includes(sl) ? sl : STATUSES[0];

        return {
          id: item.id,
          key: item.nomePadronizado,
          label: item.nomePadronizado,
          coordsPx,
          nome:item.nome,
          img: selectImage(),
          statusLocal: initialStatus,
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

  const handleToggle = async (el) => {
    const { id, statusLocal, original, key } = el;
    const idx = STATUSES.indexOf(statusLocal);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    const nextEnum = next.toUpperCase();
    const dto = { ...original, statusEnum: nextEnum };

    setElementosData(prev => prev.map(e => e.id === id ? { ...e, statusLocal: next } : e));
    setUpdatingIds(prev => new Set(prev).add(id));
    setError("");

    try {
      const response = await api.put("/distribuicao", dto, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const updated = response.data;
      setElementosData(prev => prev.map(e => e.id === id ? { ...e, original: { ...e.original, ...updated }, statusLocal: next } : e));
    } catch {
      setElementosData(prev => prev.map(e => e.id === id ? { ...e, statusLocal } : e));
      setError(`Falha ao atualizar ${key}.`);
    } finally {
      setUpdatingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  // px to %
  const toPct = (px, total) => `${(px/total)*100}%`;

  return (
    <div className="relative top-20 w-full max-w-xl" style={{ transform:'scale(1.5)' ,aspectRatio:`${ORIGINAL_WIDTH}/${ORIGINAL_HEIGHT}` }}>
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
        // Label acima
        const labelTop = y - 22;
        return (
          <>
            <div
            className="mx-12"
              key={`${el.id}-label`}
              aria-hidden
              style={{
                position: 'absolute',
                left: toPct(x, ORIGINAL_WIDTH),
                top: toPct(labelTop, ORIGINAL_HEIGHT),
                transform: 'translateY(-100%)',
                padding: '2px 4px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
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
                position: "absolute",
                left:   toPct(x, ORIGINAL_WIDTH),
                top:    toPct(y, ORIGINAL_HEIGHT),
                width:  toPct(w, ORIGINAL_WIDTH),
                height: toPct(h, ORIGINAL_HEIGHT),
                padding: 0,
                margin: 0,
                cursor: isUpdating ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isUpdating ? 0.6 : 1,
              }}
            >
              <img
                src={el.img}
                alt={el.label}
                style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", filter: filters[el.statusLocal], transition: "filter 0.3s" }}
              />
            </button>
          </>
        );
      })}
    </div>
  );
}
