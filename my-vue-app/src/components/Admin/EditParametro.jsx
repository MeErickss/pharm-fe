import { useState, useEffect } from "react";
import axios from "axios";
import { SelectInput } from "./SelectInput"

// Componente para renderizar o Select
export function EditParametro({ id, dados, closeModal }) {
  console.log(dados)
  const [valoresEditados, setValoresEditados] = useState(
    Object.fromEntries(Object.keys(dados[0]).map((key) => [key, dados[id - 1][key] || ""]))
  );

  const handleEdit = (e, key) => {
    let value = e.target.value;
    console.log(value)

    setValoresEditados((prev) => {
      let updatedValues = { ...prev, [key]: value };
  
      // Garantir que VL_MIN não seja maior que VL_MAX
      if (key === "VL_MIN" && parseFloat(value) > parseFloat(prev.VL_MAX)) {
        updatedValues.VL_MAX = value;
      }
  
      // Garantir que VL_MAX não seja menor que VL_MIN
      if (key === "VL_MAX" && parseFloat(value) < parseFloat(prev.VL_MIN)) {
        updatedValues.VL_MIN = value;
      }
  
      return updatedValues;
    });
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(valoresEditados)
  
    try {
      await axios.put("http://localhost:5000/api/update", {
        table: "parametros", // Nome da tabela
        values: valoresEditados, // Objeto com todos os campos editados
        id:valoresEditados.id
      });
  
      alert("Parâmetro editado com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao editar parâmetro:", error);
      alert("Erro ao editar parâmetro!");
    }
  };
  

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Editar Parâmetro <strong className="border-l-4 pl-1 border-blue-700">{valoresEditados.PARAMETRO}</strong>
        </h2>
        <button onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {dados.length > 0 && (
        <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-700 p-3 border-b gap-2">
          {Object.entries(dados[id - 1]).map(([key]) => 
            key !== "ID" && key != "UNIDADE" && (
              <div key={key}>
                <div className="px-2">{key}</div>
                {["STATUS", "FUNCAO", "MEDIDA"].includes(key) && valoresEditados != undefined ? (
                  <SelectInput table={key} value={valoresEditados[key]} onChange={(e) => handleEdit(e, key)} />
                ) : (
                  <input
                    type={key === "VALOR" || key === "VL_MIN" || key === "VL_MAX" ? "number" : "text"}
                    className="w-11/12 border p-1 rounded"
                    onChange={(e) => handleEdit(e, key)}
                    value={valoresEditados[key]}
                    min={key==="VALOR" ? valoresEditados.VL_MIN : ""}
                    max={key==="VALOR" ? valoresEditados.VL_MAX : ""}
                    placeholder={`Digite ${key}`}
                  />
                )}
              </div>
            )
          )}
        </div>
      )}


      <form onSubmit={handleSubmit} className="flex justify-end gap-4 mt-4">
        <button type="submit" className="w-[12rem] bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Concluir
        </button>
      </form>
    </div>
  );
}
