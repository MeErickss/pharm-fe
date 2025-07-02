import { useState, useEffect } from "react";
import farmacia from "./images/farmacia.png";
import filtros from "./images/filtros.png";
import purifier from "./images/purifier.png";
import { Farmacia } from "./images/Farmacia";
import { Distribuicao } from "./images/Distribuicao";

export function Home() {
  const [width, setWidth] = useState(window.innerWidth);

  return (
    <div className="flex flex-wrap w-full h-full bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 p-8">Página Inicial</h1>

      <div className="flex flex-row w-1/2 mt-20 ml-[-12rem]">
        <div className="w-full">
          <Farmacia/>
        </div>
        <div className="w-full">
          <Distribuicao/>
        </div>
      </div>



      {/* Barra lateral fixa */}
      <div className="flex fixed right-0 h-screen flex-wrap flex-col px-4 gap-10 bg-gray-300">
        <div className="rounded-tl-lg rounded-br-lg mt-4 hover:shadow-2xl">
          <img className="bg-black" style={{ width: `${width/9}px` }} src={farmacia} alt="Farmácia" />
        </div>
        <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl">
          <img className="w-[280px]" style={{ width: `${width/9}px` }} src={filtros} alt="Filtros" />
        </div>
        <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl">
          <img className="w-[280px]" style={{ width: `${width/9}px` }} src={purifier} alt="Purifier" />
        </div>
      </div>
    </div>
  );
}
