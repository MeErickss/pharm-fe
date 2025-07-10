// AdicionarParametro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { SelectInputInsert } from "./SelectInputInsert";
import correcoes from "../dicionario";

export function AdicionarParametro({ dados, closeModal, param }) {
  const navigator = useNavigate();

  // Inicializa valores com dados do primeiro elemento ou string vazia
  const inicial = Object.fromEntries(
    Object.keys(dados[0]).map(key => [key, dados[0][key] || ""])
  );
  const [valores, setValores] = useState(inicial);

  // Campos que usam SelectInputInsert
  const selectFields = ["status", "funcao", "grandeza", "formula"];

  const handleEdit = (value, key) => {
    setValores(prev => {
      const updated = { ...prev };
      if (key === "grandeza" && typeof value === "object") {
        updated.grandeza = value.grandeza;
        updated.unidade = value.unidade;
      } else {
        updated[key] = value;
      }

      if (key === "vlMin" && parseFloat(updated.vlMin) > parseFloat(updated.vlMax)) {
        updated.vlMax = updated.vlMin;
      }
      if (key === "vlMax" && parseFloat(updated.vlMax) < parseFloat(updated.vlMin)) {
        updated.vlMin = updated.vlMax;
      }
      console.log(updated)
      return updated;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    const body = {
      descricao:   valores.descricao,
      vlmin:       Number(valores.vlMin),
      vlmax:       Number(valores.vlMax),
      valor:       Number(valores.valor),
      statusenum:  valores.status,    
      unidadeDesc:  valores.unidade, 
      grandezaDesc: valores.grandeza,
      funcao:       valores.funcao,
      formulaEnum: valores.formula
    };

    console.log(body)

  
    try {
      await api.post(
        "/parametro",
        body,
        {
          params: {
            userLogin: localStorage.getItem("login")
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
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
        <h2 className="text-lg font-semibold">Adicionar Parâmetro</h2>
        <button onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </button>
      </div>

      {dados.length > 0 && (
        <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-700 p-3 border-b gap-2">
          {Object.keys(dados[0]).map(key => (
            key !== "id" && key !== "unidade" && (
              <div key={key} className={key === "descricao" ? "col-span-3 w-[48.3rem]" : undefined}>
                <div className="px-2 text-black"><strong>{correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}
                </strong></div>
                {selectFields.includes(key) ? (
                  <SelectInputInsert
                    table={key}
                    param={param}
                    value={valores[key]}
                    onChange={val => handleEdit(val, key)}
                    isUnidade={true}
                  />
                ) : (
                  <input
                    type={ ["valor","vlMin","vlMax"].includes(key) ? "number" : "text" }
                    className="w-11/12 border p-1 rounded mt-1 bg-gray-50 text-neutral-500 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onChange={e => handleEdit(e.target.value, key)}
                    min={key === "valor" ? valores.vlMin : undefined}
                    max={key === "valor" ? valores.vlMax : undefined}
                    placeholder={`Digite ${correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}`}
                  />
                )}
              </div>
            )
          ))}
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
