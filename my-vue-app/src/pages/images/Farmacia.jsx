import { useState } from "react";
import farmaciaImg from "./Tudo/farmacia.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba.png";

const ORIGINAL_WIDTH = 591;
const ORIGINAL_HEIGHT = 435;

const elementos = [
  {
    key: 'valvula1',
    label: 'Válvula 1',
    img: valvula1Img,
    // coords em px: x, y, largura e altura na imagem original
    coordsPx: { x: 70, y: 46, w: 40, h: 40 },
  },
  {
    key: 'valvula2',
    label: 'Válvula 2',
    img: valvula2Img,
    coordsPx: { x: 185, y: 80, w: 40, h: 40 },
  },
  {
    key: 'sensor1',
    label: 'Sensor 1',
    img: sensor1Img,
    coordsPx: { x: 150, y: 42, w: 30, h: 30 },
  },
  {
    key: 'sensor2',
    label: 'Sensor 2',
    img: sensor2Img,
    coordsPx: { x: 105, y: 96, w: 30, h: 30 },
  },
  {
    key: 'bomba',
    label: 'Bomba',
    img: bombaImg,
    coordsPx: { x: 140, y: 140, w: 50, h: 50 },
  },
];

export function Farmacia() {
  // Estado de ativo/inativo para cada overlay
  const [status, setStatus] = useState(() => {
    const init = {};
    elementos.forEach(el => { init[el.key] = false; });
    return init;
  });

  const handleToggle = (key) => {
    setStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Função que converte px em percentual string
  const toPct = (pxValue, totalPx) => {
    return `${(pxValue / totalPx) * 100}%`;
  };

  return (
    // Contêiner relativo que mantém proporção 591:435
    <div
      className="relative w-full max-w-xl"
      style={{
        aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}`
      }}
    >
      {/* Imagem de fundo */}
      <img
        src={farmaciaImg}
        alt="Diagrama Farmácia"
        style={{
          position: 'absolute',
          left: 0, top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover', // ou 'contain' se preferir ver toda imagem sem cortes
        }}
      />

      {/* Overlays */}
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
