import { useState } from "react";
import { Parameters } from "./Parameters";

export function Footer() {
  const [parametro, setParametro] = useState(false);

  return (
    <div className="flex flex-wrap w-full h-full justify-center items-center relative">
      <button className="bg-white p-2 border rounded" onClick={() => setParametro(true)}>Parameters</button>

      {parametro && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Parameters onClose={() => setParametro(false)} />
        </div>
      )}
    </div>
  );
}
