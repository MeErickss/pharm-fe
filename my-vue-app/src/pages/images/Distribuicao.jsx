import { useState } from "react";
import distribuicaoImg from "./Tudo/distribuicao.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import bomba2Img from "./Tudo/bomba2.png";

const ORIGINAL_WIDTH = 520;
const ORIGINAL_HEIGHT = 401;


const elementos = [
  {
    key: 'valvula1_a',
    label: 'Válvula 1A',
    img: valvula1Img,
    coordsPx: { x: 92, y: 26, w: 30, h: 30 },
  },
  {
    key: 'valvula1_b',
    label: 'Válvula 1B',
    img: valvula1Img,
    coordsPx: { x: 109, y: 26, w: 30, h: 30 },
  },
  {
    key: 'valvula1_c',
    label: 'Válvula 1C',
    img: valvula1Img,
    coordsPx: { x: 92, y: 26, w: 30, h: 30 },
  },
  {
    key: 'valvula1_d',
    label: 'Válvula 1D',
    img: valvula1Img,
    coordsPx: { x: 69, y: 70, w: 30, h: 30 },
  },
  {
    key: 'valvula2_a',
    label: 'Válvula 2A',
    img: valvula2Img,
    coordsPx: { x: 88, y: 104, w: 30, h: 30 },
  },
  {
    key: 'valvula2_b',
    label: 'Válvula 2B',
    img: valvula2Img,
    coordsPx: { x: 85, y: 43, w: 30, h: 30 },
  },
  {
    key: 'valvula2_c',
    label: 'Válvula 2C',
    img: valvula2Img,
    coordsPx: { x: 118, y: 104, w: 30, h: 30 },
  },
  {
    key: 'sensor1',
    label: 'Sensor 1',
    img: sensor1Img,
    coordsPx: { x: 107, y: 42, w: 25, h: 25 },
  },
  {
    key: 'bomba2_a',
    label: 'Bomba 2A',
    img: bomba2Img,
    coordsPx: { x: 146, y: 90, w: 40, h: 40 },
  },
  {
    key: 'bomba2_b',
    label: 'Bomba 2B',
    img: bomba2Img,
    coordsPx: { x: 146, y: 120, w: 40, h: 40 },
  },
];

export function Distribuicao() {
  const [status, setStatus] = useState(() => {
    const init = {};
    elementos.forEach(el => { init[el.key] = false; });
    return init;
  });

  const handleToggle = (key) => {
    setStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Converte px em percentual string
  const toPct = (pxValue, totalPx) => {
    return `${(pxValue / totalPx) * 100}%`;
  };

  return (
    <div
      className="relative w-full max-w-xl"
      style={{
        aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}`,
      }}
    >
      {/* Imagem de fundo ocupando todo o contêiner */}
      <img
        src={distribuicaoImg}
        alt="Diagrama Distribuição"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      {/* Overlays dinamicamente posicionados */}
      {elementos.map(el => {
        const ativo = status[el.key];
        const { x, y, w, h } = el.coordsPx;
        const styleOverlay = {
          position: 'absolute',
          left: toPct(x, ORIGINAL_WIDTH),
          top: toPct(y, ORIGINAL_HEIGHT),
          width: toPct(w, ORIGINAL_WIDTH),
          height: toPct(h, ORIGINAL_HEIGHT),
          backgroundColor: ativo ? 'rgba(0, 128, 0, 0.4)' : 'transparent',
          border: ativo ? '2px solid rgba(0,128,0,0.7)' : 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          transition: 'background-color 0.3s, border-color 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        };
        return (
          <button
            key={el.key}
            onClick={() => handleToggle(el.key)}
            aria-label={`${el.label} ${ativo ? 'ativo' : 'inativo'}`}
            style={styleOverlay}
          >
            <img
              src={el.img}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
