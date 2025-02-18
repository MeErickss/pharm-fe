import { useState } from "react";
import axios from "axios";

export function AddParametro({ dados, closeModal }) {
    const [valores, setValores] = useState(
        Object.fromEntries(Object.keys(dados[0]).map((key) => [key, dados[0][key] || ""]))
      );
      
    console.log(valores)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post("http://localhost:5000/api/insert?table=${tabela}&value=${dell}", { nome, valor });
          alert("Parâmetro adicionado com sucesso!");
          closeModal(); // Fecha o modal após o sucesso
        } catch (error) {
          console.error("Erro ao adicionar parâmetro:", error);
        }
    };

    return (
        <div>
          <div className="flex flex-row justify-between mb-2">
            <h2 className="text-lg font-semibold">Adicionar Parâmetro</h2>
            <button onClick={() => closeModal()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </svg>
            </button>
          </div>

        {dados.length > 0 && (
            <div className="grid grid-cols-3 bg-gray-200 font-semibold text-gray-700 p-3 border-b gap-2">
              {Object.keys(dados[0]).map((key) => (
                <div key={key}>
                  <div className="px-2">{key}</div>
                  <input
                    type="text"
                    className="border p-1 rounded"
                    placeholder={`Digite ${key}`}
                  />
                </div>
              ))}
            </div>
        )}


          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Adicionar
            </button>
          </form>
        </div>
    );
}
