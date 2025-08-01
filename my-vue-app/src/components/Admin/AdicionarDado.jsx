import { useState } from "react";
import api from "../../api";
import { SelectInputInsert } from "./SelectInputInsert"
import correcoes from "../dicionario";

// Componente para renderizar o Select
export function AdicionarDado({ dados, closeModal, table, param }) {
  const [valores, setValores] = useState(
    Object.fromEntries(Object.keys(dados[0]).map((key) => [key, dados[0][key] || ""]))
  );



  const handleEdit = (value, key) => {
    setValores(prev => {
      const updated = { ...prev };
      if (key === "grandeza" && typeof value === "object") {
        const { grandeza: novaGrandeza, unidade: novaUnidade } = value;
        updated.grandeza = novaGrandeza;
     if (novaUnidade) {
       updated.unidade = novaUnidade;
     }
      } else {
        updated[key] = value;
      }
      if (key === "vlMin" && parseFloat(updated.vlMin) > parseFloat(updated.vlMax)) {
        updated.vlMax = updated.vlMin;
      }
      if (key === "vlMax" && parseFloat(updated.vlMax) < parseFloat(updated.vlMin)) {
        updated.vlMin = updated.vlMax;
      }
      return updated;
    });
  };


  const handleSubmit = async e => {
    e.preventDefault();
    console.log(table)

    delete valores.id

    console.log(valores)
    console.log("body")

    try {
      await api.post(`/${table}`, valores, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Registro inserido com sucesso!");
      closeModal();
    } catch (error) {
      if (error.response?.status === 401) navigator("/login");
      console.error("❌ Erro ao inserir registro:", error);
      alert("Erro ao inserir registro. Verifique os dados e tente novamente!");
    } finally{
      window.location.reload()
    }
  };
  

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Adicionar Dado
        </h2>
        <button onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {dados.length > 0 && (
        <div className="grid grid-cols-3 items-center justify-center bg-gray-200 font-semibold text-gray-700 p-3 border-b gap-2">
          {Object.entries(dados[0]).map(([key]) =>
            key !== "id" && (
              <div key={key}>
                <div className="px-2 text-black"><strong>{correcoes[key] ?? key[0].toUpperCase() + key.substring(1)}</strong></div>
                {["status", "grandeza", "funcao", "nivel", "clpTipo", "offset", "tipoUso"].includes(key) ? (
                  <SelectInputInsert
                    table={key}
                    param={param}
                    value={valores[key]}
                    onChange={val => handleEdit(val, key)}
                  />
                ) : (
                  <input
                    type={["valor", "vlMin", "vlMax", "enderecoCLP", "tamanho" ].includes(key) ? "number" : "text"}
                    className="w-11/12 border p-1 rounded mt-1 bg-gray-50 text-neutral-500 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onChange={(e) => handleEdit(e.target.value, key)}
                    min={key === "valor" ? valores.vlMin : ""}
                    max={key === "valor" ? valores.vlMax : ""}
                    placeholder={`Digite ${correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}`}
                  />

                )}
              </div>
            )
          )}
        </div>
      )}


      <form onSubmit={handleSubmit} className="flex justify-end gap-4 mt-4">
        <button type="submit" className="w-[12rem] bg-blue-500 hover:brightness-90 text-white py-2 px-4 rounded">
          Adicionar
        </button>
      </form>
    </div>
  );
}
