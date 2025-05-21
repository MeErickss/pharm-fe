import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputInsert } from "./SelectInputInsert";
import { SelectInputUpdate } from "./SelectInputUpdate";

// Componente para renderizar o formulário de atualização
export function AtualizarDados({ dados, closeModal, table, param }) {
  const [valoresEditados, setValoresEditados] = useState(
    Object.fromEntries(
      Object.keys(dados[0]).map((key) => [key, dados[0][key] || ""])
    )
  );

  // Debug: log sempre que valoresEditados mudar
  useEffect(() => {
    console.log("valoresEditados:", valoresEditados);
  }, [valoresEditados]);

  const handleEdit = (value, key) => {
    setValoresEditados((prev) => {
      const updated = { ...prev };

      if (key === "grandeza" && typeof value === "object") {
        updated.grandeza = value.grandeza || "";
        updated.unidade = value.unidade || "";
      } else {
        updated[key] = value;
      }

      // Ajuste automático de vlMin/vlMax
      if (key === "vlMin" && parseFloat(value) > parseFloat(prev.vlMax)) {
        updated.vlMax = value;
      }
      if (key === "vlMax" && parseFloat(value) < parseFloat(prev.vlMin)) {
        updated.vlMin = value;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envia o objeto completo para o backend
      await api.put(
        `/parametro/${valoresEditados.id}`,
        valoresEditados,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Parâmetro editado com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao editar parâmetro:", error);
      alert("Erro ao editar parâmetro. Por favor, tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-row justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Editar Dado{' '}
          <strong className="border-l-4 pl-1 border-blue-700">
            {valoresEditados.descricao || valoresEditados.nome || valoresEditados.unidade || valoresEditados.login}
          </strong>
        </h2>
        <button type="button" onClick={closeModal}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-500 p-3 border-b gap-2">
        {Object.keys(dados[0]).map((key) =>
          key === "id" ? null : (
            <div key={key}>
                <div className="px-2 text-black"><strong>{key.toUpperCase()}</strong></div>
                { ["status", "grandeza", "nivel"].includes(key) ? (
                <SelectInputUpdate
                  table={key}
                  value={valoresEditados[key]}
                  onChange={(sel) => handleEdit(sel, key)}
                />
              ) : (
                <input
                  type={["valor", "vlMin", "vlMax"].includes(key) ? "number" : "text"}
                  className="w-11/12 border p-1 rounded"
                  value={valoresEditados[key]}
                  onChange={(e) => handleEdit(e.target.value, key)}
                  min={key === "valor" ? valoresEditados.vlMin : undefined}
                  max={key === "valor" ? valoresEditados.vlMax : undefined}
                  placeholder={`Digite ${key}`}
                />
              ) }
            </div>
          )
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button type="submit" className="w-[12rem] bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Concluir
        </button>
      </div>
    </form>
  );
}
