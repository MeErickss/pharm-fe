import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputUpdate } from "./SelectInputUpdate";
import correcoes from "../dicionario";

// Componente para renderizar o formulário de atualização
export function EditarGrandeza({ dados, closeModal, table, id }) {
  const itemInicial = dados.find(item => item.id === id) || {};
  const [valores, setValores] = useState({ ...itemInicial });


  console.log(valores)
  // Debug: log sempre que valores mudar
  useEffect(() => {
    console.log("valores:", valores);
  }, [valores]);

  const handleEdit = (value, key) => {
    setValores((prev) => {
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

  const handleSubmit = async e => {
    e.preventDefault();

    console.log(valores)
    console.log("valores enviados")
    

    try {
      await api.put(`/${table}`, valores, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Registro inserido com sucesso!");
      closeModal();
    } catch (error) {
      if (error.response?.status === 401) navigator("/login");
      console.error("❌ Erro ao inserir registro:", error);
      alert("Erro ao inserir registro. Verifique os dados e tente novamente!");
    }
    finally{
      window.location.reload()
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-row justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Editar Dado{' '}
          <strong className="border-l-4 pl-1 border-blue-700">
            {valores.descricao || valores.nome || valores.unidade || valores.login}
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
          key != "id" && key != "unidade" && key != "unidades" && key != "parametros" &&  (
            <div key={key}>
                <div key={key} className="px-2 text-black"><strong>{correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}</strong></div>
                { ["status", "grandeza", "nivel"].includes(key) ? (
                <SelectInputUpdate
                  table={key}
                  value={valores[key]}
                  onChange={(sel) => handleEdit(sel, key)}
                />
              ) : (
                <input
                  type={["valor", "vlMin", "vlMax"].includes(key) ? "number" : "text"}
                    className="w-11/12 border p-1 rounded mt-1 bg-gray-50 text-neutral-500 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={valores[key]}
                  onChange={(e) => handleEdit(e.target.value, key)}
                  min={key === "valor" ? valores.vlMin : undefined}
                  max={key === "valor" ? valores.vlMax : undefined}
                  placeholder={`Digite ${correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}`}
                />
              ) }
            </div>
          )
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button type="submit" className="w-[12rem] bg-blue-500 hover:brightness-90 text-white py-2 px-4 rounded">
          Concluir
        </button>
      </div>
    </form>
  );
}
