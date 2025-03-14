import { useState, useEffect } from "react";
import axios from "axios";
import { SelectInputInsert } from "./SelectInputInsert"
import { SelectInputUpdate } from "./SelectInputUpdate";

// Componente para renderizar o Select
export function UpdateData({ dados, closeModal, table, param }) {
  const [valoresEditados, setValoresEditados] = useState(
    Object.fromEntries(Object.keys(dados[0]).map((key) => [key, dados[0][key] || ""]))
  );



  const handleEdit = (value, key) => {
    setValoresEditados((prev) => {

      let updatedValues = { ...prev };

      if (key === "GRANDEZA" && typeof value === "object") {
        updatedValues.GRANDEZA = value.grandeza || "";  // Garante que GRANDEZA não fique undefined
        updatedValues.UNIDADE = value.unidade || ""; // Garante que UNIDADE seja atribuída corretamente
      } else if(key === "STATUS"){
        updatedValues.STATUS = value.grandeza;
      }else {
        updatedValues[key] = value;
      }

      if (key === "VL_MIN" && parseFloat(value) > parseFloat(prev.VL_MAX)) {
        updatedValues.VL_MAX = value;
      }

      if (key === "VL_MAX" && parseFloat(value) < parseFloat(prev.VL_MIN)) {
        updatedValues.VL_MIN = value;
      }

      return updatedValues;
    });
    console.log(valoresEditados)
    console.log("valoresEditados")
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Dados enviados:", valoresEditados); // Verifique o que está sendo enviado
  
    try {
      await axios.put("http://localhost:5000/api/update", {
        table: table,
        values: valoresEditados,
        id: valoresEditados.ID, // Certifique-se de que está enviando o ID corretamente
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
        Editar Dado <strong className="border-l-4 pl-1 border-blue-700">{valoresEditados.PARAMETRO || valoresEditados.NOME || valoresEditados.UNIDADE|| valoresEditados.LOGIN}</strong>
        </h2>
        <button onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {dados.length > 0 && (
        <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-700 p-3 border-b gap-2">
          {Object.entries(dados[0]).map(([key]) =>
            key !== "ID" && (
              <div key={key}>
                <div className="px-2">{key}</div>
                {["STATUS", "GRANDEZA", "NIVEL"].includes(key) ? (
                  <SelectInputUpdate
                    param={param}
                    table={key}
                    value={valoresEditados[key]}
                    onChange={(selected) => handleEdit(selected, key)}
                  />
                ) : (
                  <input
                    type={key === "VALOR" || key === "VL_MIN" || key === "VL_MAX" ? "number" : "text"}
                    className="w-11/12 border p-1 rounded"
                    onChange={(e) => handleEdit(e.target.value, key)} // Corrigido aqui
                    min={key === "VALOR" ? valoresEditados.VL_MIN : ""}
                    max={key === "VALOR" ? valoresEditados.VL_MAX : ""}
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
