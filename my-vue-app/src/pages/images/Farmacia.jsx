import { useState } from "react";
import farmaciaImg from "./Tudo/farmacia.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba.png";
import barra1Img from "./Tudo/barra1.png";
import barra2Img from "./Tudo/barra2.png";

const ORIGINAL_WIDTH = 591;
const ORIGINAL_HEIGHT = 435;

// 1) Removi completamente qualquer linha de `typeof` ou `as const`
// 2) Ciclo de status
const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

// 3) Filtros CSS para cada status
const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)",
  manutencao: "grayscale(1) sepia(1) saturate(8) hue-rotate(0deg) brightness(1.2) contrast(1.2)",
  estragado:  "grayscale(1) brightness(0.2)",
};


const elementos = [
  { key: 'valvula1-1', label: 'Válvula 1-1', img: valvula1Img, coordsPx: { x:112, y:277, w:40,  h:40 } },
  { key: 'valvula1-2', label: 'Válvula 1-2', img: valvula1Img, coordsPx: { x:27,  y:90,  w:40,  h:40 } },
  { key: 'valvula1-3', label: 'Válvula 1-3', img: valvula1Img, coordsPx: { x:440, y:173, w:40,  h:40 } },
  { key: 'valvula1-4', label: 'Válvula 1-4', img: valvula1Img, coordsPx: { x:394, y:213, w:40,  h:40 } },
  { key: 'valvula1-5', label: 'Válvula 1-5', img: valvula1Img, coordsPx: { x:438, y:324, w:40,  h:40 } },
  { key: 'valvula1-6', label: 'Válvula 1-6', img: valvula1Img, coordsPx: { x:502, y:325, w:40,  h:40 } },
  { key: 'valvula2',   label: 'Válvula 2',   img: valvula2Img, coordsPx: { x:91,  y:305, w:40,  h:40 } },
  { key: 'sensor1',    label: 'Sensor 1',    img: sensor1Img, coordsPx: { x:312, y:80,  w:50,  h:50 } },
  { key: 'sensor2-1',  label: 'Sensor 2-1',  img: sensor2Img, coordsPx: { x:160, y:142, w:32, h:40 } },
  { key: 'sensor2-2',  label: 'Sensor 2-2',  img: sensor2Img, coordsPx: { x:160, y:172, w:32, h:40 } },
  { key: 'sensor2-3',  label: 'Sensor 2-3',  img: sensor2Img, coordsPx: { x:160, y:207, w:32, h:40 } },
  { key: 'bomba',      label: 'Bomba',       img: bombaImg,  coordsPx: { x:280, y:305, w:80,  h:80 } },
  { key: 'bomba-2',    label: 'Bomba-2',     img: bombaImg,  coordsPx: { x:280, y:305, w:80,  h:80 } },
  { key: 'Nivel_ta',   label: 'Nivel_ta',    img: barra1Img, coordsPx: { x:220, y:105, w:70, h:135 } },
  { key: 'Nivel_tm',   label: 'Nivel_tm',    img: barra2Img, coordsPx: { x:106,  y:155, w:50,  h:84 } },
];

export function Farmacia() {
  // 4) statusMap inicial: cada key começa em "desligado"
  const [statusMap, setStatusMap] = useState(() => {
    const init = {};
    elementos.forEach(el => { init[el.key] = STATUSES[0]; });
    return init;
  });

  // 5) no clique, avança para o próximo STATUS
  const handleToggle = (key) => {
    setStatusMap(prev => {
      const current = prev[key];
      const idx = STATUSES.indexOf(current);
      const next = STATUSES[(idx + 1) % STATUSES.length];
      console.log(`${key} → ${next}`); // DEBUG: veja no console
      return { ...prev, [key]: next };
    });
  };

  // conversão px → %
  const toPct = (px, total) => `${(px/total)*100}%`;

  return (
    <div
      className="relative w-full max-w-xl"
      style={{ aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}` }}
    >
      {/* fundo */}
      <img
        src={farmaciaImg}
        alt="Diagrama Farmácia"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
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
              border: "2px dashed red"
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
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
