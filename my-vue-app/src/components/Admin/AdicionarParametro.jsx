import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputInsert } from "./SelectInputInsert"

// Componente para renderizar o Select
export function AdicionarParametro({ dados, closeModal, param }) {
  const [valoresEditados, setValoresEditados] = useState(
    Object.fromEntries(Object.keys(dados[0]).map((key) => [key, dados[0][key] || ""]))
  );


  const handleEdit = (value, key) => {
    setValoresEditados((prev) => {
      let updatedValues = { ...prev };

      if (key === "grandeza" && typeof value === "object") {
        updatedValues.grandeza = value.grandeza || "";  // Garante que GRANDEZA não fique undefined
        updatedValues.unidade = value.unidade || ""; // Garante que UNIDADE seja atribuída corretamente
      } else if(key === "status"){
        updatedValues.status = value.grandeza;
      }else {
        updatedValues[key] = value;
      }

      if (key === "vlMin" && parseFloat(value) > parseFloat(prev.vlMax)) {
        updatedValues.vlMax = value;
      }

      if (key === "vlMax" && parseFloat(value) < parseFloat(prev.vlMin)) {
        updatedValues.vlMin = value;
      }

      return updatedValues;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    api.post("/parametro", valoresEditados)
      .then((response) => {
        setDados(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // Redirecionar para login se não autenticado
          navigator('/login'); 
        }
        console.error("Erro ao buscar dados", err);
      });
  };
  



  return (
    <div>
      {/* … cabeçalho */}
      {dados.length > 0 && (
        <div className="grid grid-cols-3 …">
          {Object.keys(dados[0]).map((key) =>
            key === "id" ? null : (
              <div key={key}>
                <div className="px-2">{key.toUpperCase()}</div>
                {selectFields.includes(key) ? (
                  <SelectInputInsert
                    table={key}
                    value={valoresEditados[key]}
                    onChange={(obj) => handleEdit(obj, key)}
                  />
                ) : (
                  <input
                    type={
                      ["vlMin", "vlMax", "valor"].includes(key)
                        ? "number"
                        : "text"
                    }
                    className="w-11/12 border p-1 rounded"
                    value={valoresEditados[key]}
                    onChange={(e) =>
                      handleEdit(e.target.value, key)
                    }
                    min={
                      key === "valor" ? valoresEditados.vlMin : undefined
                    }
                    max={
                      key === "valor" ? valoresEditados.vlMax : undefined
                    }
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
          Adicionar
        </button>
      </form>
    </div>
  );
}
