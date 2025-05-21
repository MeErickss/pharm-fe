import { useState, useEffect } from "react";
import image from "./images/g.png";
import farmacia from "./images/farmacia.png";
import filtros from "./images/filtros.png";
import purifier from "./images/purifier.png";
import CollapseC from "../components/Collapse"

export function Home() {
  const [width, setWidth] = useState(window.innerWidth);

  return (
    <div className="flex flex-wrap w-full h-full bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 p-8">Home</h1>

      {/* Imagem principal ajustável */}
      <div className="w-full md:w-[64.3rem]">
        <img className="w-full" src={image} alt="Main" />
      </div>

      {/* Barra lateral fixa */}
      <div className="flex fixed right-0 h-screen flex-wrap flex-col px-4 gap-10 bg-gray-300">
        <div className="rounded-tl-lg rounded-br-lg mt-4 hover:shadow-2xl">
          <img className="bg-black" style={{ width: `${width/7}px` }} src={farmacia} alt="Farmácia" />
        </div>
        <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl">
          <img className="w-[280px]" style={{ width: `${width/7}px` }} src={filtros} alt="Filtros" />
        </div>
        <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl">
          <img className="w-[280px]" style={{ width: `${width/7}px` }} src={purifier} alt="Purifier" />
        </div>
      </div>
    </div>
  );
}
