import { useState } from "react";
import distribuicaoImg from "./Tudo/distribuicao.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import bomba2Img from "./Tudo/bomba2.png";

const ORIGINAL_WIDTH = 520;
const ORIGINAL_HEIGHT = 400;

// ciclo de status
const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

// filtros para cada status
const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(0.7) saturate(8) hue-rotate(90deg) brightness(0.9)",
  manutencao: "grayscale(1) sepia(1) saturate(5) hue-rotate(0deg) brightness(1.2) contrast(1)",
  estragado:  "grayscale(1) brightness(0.2)",
};


const elementos = [
  { key: 'valvula1-1', label: 'Válvula1-1', img: valvula1Img, coordsPx: { x:157, y:54,  w:30, h:30 } },
  { key: 'valvula1-2', label: 'Válvula1-2', img: valvula1Img, coordsPx: { x:222, y:54,  w:30, h:30 } },
  { key: 'valvula1_c', label: 'Válvula 1C', img: valvula1Img, coordsPx: { x:60,  y:167, w:30, h:30 } },
  { key: 'valvula2-1', label: 'Válvula2-1', img: valvula2Img, coordsPx: { x:126, y:99,  w:30, h:30 } },
  { key: 'valvula2-2', label: 'Válvula2-2', img: valvula2Img, coordsPx: { x:137, y:259, w:30, h:30 } },
  { key: 'valvula2-3', label: 'Válvula2-3', img: valvula2Img, coordsPx: { x:270, y:258, w:30, h:30 } },
  { key: 'sensor1',    label: 'Sensor 1',    img: sensor1Img, coordsPx: { x:224, y:90,  w:50, h:50 } },
  { key: 'bomba2-1',   label: 'Bomba2-1',    img: bomba2Img,  coordsPx: { x:375, y:300, w:65, h:65 } },
  { key: 'bomba2-2',   label: 'Bomba2-2',    img: bomba2Img,  coordsPx: { x:376, y:220, w:65, h:65 } },
];

export function Distribuicao() {
  // mapa de status inicial: todos "desligado"
  const [statusMap, setStatusMap] = useState(() => {
    const init = {};
    elementos.forEach(el => { init[el.key] = STATUSES[0]; });
    return init;
  });

  // avança status no clique
  const handleToggle = (key) => {
    setStatusMap(prev => {
      const current = prev[key];
      const idx = STATUSES.indexOf(current);
      const next = STATUSES[(idx + 1) % STATUSES.length];
      return { ...prev, [key]: next };
    });
  };

  const toPct = (px, total) => `${(px / total) * 100}%`;

  return (
    <div
      className="relative w-full max-w-xl"
      style={{ aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}` }}
    >
      {/* fundo */}
      <img
        src={distribuicaoImg}
        alt="Diagrama Distribuição"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* overlays */}
      {elementos.map(el => {
        const st = statusMap[el.key];
        const { x, y, w, h } = el.coordsPx;

        return (
          <button
            key={el.key}
            onClick={() => handleToggle(el.key)}
            aria-label={`${el.label} está ${st}`}
            style={{
              position: "absolute",
              left:   toPct(x, ORIGINAL_WIDTH),
              top:    toPct(y, ORIGINAL_HEIGHT),
              width:  toPct(w, ORIGINAL_WIDTH),
              height: toPct(h, ORIGINAL_HEIGHT),
              padding: 0,
              margin: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={el.img}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
                filter: filters[st],
                transition: "filter 0.3s",
                border: "2px dashed red"
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
