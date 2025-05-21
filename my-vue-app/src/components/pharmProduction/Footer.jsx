import { useState } from "react";

export function Footer() {
  const [parametro, setParametro] = useState(false);

  return (
    <div className="flex flex-wrap w-full h-full justify-center items-center relative">
      <button className="bg-white p-2 border rounded" onClick={() => setParametro(true)}>Parameters</button>
    </div>
  );
}
