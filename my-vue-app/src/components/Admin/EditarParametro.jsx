// EditarParametro.jsx
import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputUpdate } from "./SelectInputUpdate";

export function EditarParametro({ id, dados, closeModal, param }) {
  // encontra o item que corresponde ao id e inicializa o estado
  const itemInicial = dados.find(item => item.id === id) || {};
  const [valoresEditados, setValoresEditados] = useState({ ...itemInicial });

  // debug para ver o estado sempre que mudar
  useEffect(() => {
    console.log("valoresEditados:", valoresEditados);
  }, [valoresEditados]);

  // atualiza campos, incluindo cascata de grandeza→unidade
  const handleEdit = (value, key) => {
    setValoresEditados(prev => {
      const updated = { ...prev };
      console.log(value)

      if (key === "grandeza" && typeof value === "object") {
        updated.grandeza = value.grandeza || "";
        updated.unidade = value.unidade || ""; // reseta unidade ao mudar grandeza
      } else if (key === "status" || key === "funcao") {
        updated[key] = value; // string simples
      } else {
        updated[key] = value;
      }

      // ajuste automático de limites
      if (key === "vlMin" && parseFloat(updated.vlMin) > parseFloat(updated.vlMax)) {
        updated.vlMax = updated.vlMin;
      }
      if (key === "vlMax" && parseFloat(updated.vlMax) < parseFloat(updated.vlMin)) {
        updated.vlMin = updated.vlMax;
      }

      return updated;
    });
  };

  // envia PUT para editar o parâmetro
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(
        `/parametro/${valoresEditados.id}`,
        valoresEditados,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Parâmetro editado com sucesso!");
      closeModal();
    } catch (err) {
      console.error("Erro ao editar parâmetro:", err);
      alert("Erro ao editar parâmetro!");
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Editar Parâmetro{" "}
          <strong className="border-l-4 pl-1 border-blue-700">
            {valoresEditados.descricao}
          </strong>
        </h2>
        <button onClick={closeModal} className="text-red-600 hover:text-red-900">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {/* Grid de campos */}
      <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-500 p-3 border-b gap-2">
        {Object.keys(itemInicial).map(key => {
          // exclui id e unidade, pois o componente SelectInputUpdate já faz cascata
          if (key === "id" || key === "unidade") return null;

          const isSelect = ["status", "funcao", "grandeza"].includes(key);

          return (
            <div key={key} className={key === "descricao" ? "col-span-3 w-[48.3rem]" : undefined}>
              <div className="px-2 text-black">
                <strong>{key.toUpperCase()}</strong>
              </div>

              {isSelect ? (
                <SelectInputUpdate
                  table={key}
                  value={valoresEditados}
                  param={param}
                  onChange={value => handleEdit(value, key)}
                />
              ) : (
                <input
                  type={["valor","vlMin","vlMax"].includes(key) ? "number" : "text"}
                  className="w-11/12 border p-1 rounded"
                  value={valoresEditados[key] ?? ""}
                  onChange={e => handleEdit(e.target.value, key)}
                  min={key === "valor" ? valoresEditados.vlMin : undefined}
                  max={key === "valor" ? valoresEditados.vlMax : undefined}
                  placeholder={`Digite ${key}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Botão de salvar */}
      <form onSubmit={handleSubmit} className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="w-[12rem] bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Concluir
        </button>
      </form>
    </div>
  );
}
