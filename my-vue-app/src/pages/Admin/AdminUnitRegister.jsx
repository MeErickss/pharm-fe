import { useState, useEffect } from "react";
import axios from "axios";

export function AdminUnitRegister() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [editar, setEditar] = useState(true);
  const [dadosLen, setDadosLen] = useState(0);
  const tabela = "unidades"
  

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/table?table=${tabela}`)
      .then((response) => {
        console.log("Dados recebidos:", response.data);
        setDados(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

  // Atualiza dadosLen apenas quando `dados` mudar
  useEffect(() => {
    if (dados.length > 0) {
      setDadosLen(Object.keys(dados[0]).length);
    }
  }, [dados]);

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
        {dados.length > 0 && (
          <div
            className="grid bg-gray-200 font-semibold text-gray-700 p-3 border-b"
            style={{ gridTemplateColumns: `minmax(4rem, auto) repeat(${dadosLen}, minmax(0, 1fr))` }}
          >
            {Object.keys(dados[0]).map((key, index) => (
              <div key={key} className="px-2">
                {key}
              </div>
            ))}
            <div className="px-2">Ações</div>
          </div>
        )}
    
        {/* Linhas de dados dinâmicas */}
        {dados.map((x) => (
          <div
            key={x.ID}
            className="grid p-3 border-b items-center"
            style={{ gridTemplateColumns: `minmax(4rem, auto) repeat(${dadosLen}, minmax(0, 1fr))` }}
          >
            {Object.values(x).map((value, index) => (
              <div key={index} className="px-2">
                {value}
              </div>
            ))}
    
            {/* Botões de ação */}
            <div className="flex gap-4">
              {editar ? (
                <button onClick={() => setEditar(!editar)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="16"
                    className="hover:fill-orange-500"
                  >
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                  </svg>
                </button>
              ) : (
                <button onClick={() => setEditar(!editar)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    viewBox="0 0 448 512"
                    className="hover:fill-green-500"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                  </svg>
                </button>
              )}
    
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="16"
                  className="hover:fill-red-500"
                >
                  <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
