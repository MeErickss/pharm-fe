import React from "react";

export function Teste() {
  const valor = 20;      // valor de 0 a 100
  const trackHeight = 200; // altura total em px
  const trackWidth = 16;   // largura em px

  // altura do fill em px
  const fillHeight = (valor / 100) * trackHeight;

  return (
    <div className="flex flex-col items-center">
      {/* Track */}
      <div
        className="relative bg-gray-200 rounded-full"
        style={{ width: `${trackWidth}px`, height: `${trackHeight}px` }}
      >
        {/* Fill */}
        <div
          className="absolute bottom-0 bg-blue-400 rounded-t-full"
          style={{
            width: "100%",
            height: `${fillHeight}px`,
          }}
        />

        {/* Marker */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            // posiciona a bolinha no topo do fill:
            bottom: `${fillHeight - 8}px`,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-6 h-[0.5rem] bg-gray-400" />
        </div>
      </div>

      {/* Label */}
      <span className="mt-2 text-base font-medium text-gray-700">
        {valor}
      </span>
    </div>
  );
}
