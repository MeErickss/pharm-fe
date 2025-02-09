import { useState, useEffect } from "react";
import axios from "axios";


export function AdminStorageRegister(){
    const [error, setError] = useState("");
    const [dados, setDados] = useState([]); // Definindo o estado corretamente
  
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/parametros_producao")
        .then((response) => {
          console.log("Dados recebidos:", response.data);
          setDados(response.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar dados", err);
          setError("Não foi possível carregar os dados");
        });
    }, []);
    return(
        <div className="flex flex-wrap w-full h-full bg-gray-100">
            <div className="grid grid-rows-[auto_1fr_auto] grid-cols-8">
              <div className="grid bg-gray-200 col-span-2 border-y-2 border-gray-300 p-2">
                Parametro
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Tipo
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Unidade
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Valor
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Valor Minimo
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Valor Maximo
              </div>
              <div className="grid bg-gray-200 border-y-2 border-gray-300 p-2">
                Ações
              </div>
              {dados.map((x)=>
                <>
                  <div className="px-4 border-b-2 col-span-2 border-gray-300">{x.PARAMETRO}</div>
                  <div className="px-4 border-b-2 border-gray-300">{x.TIPO}</div>
                  <div className="px-4 border-b-2 border-gray-300">{x.UNID}</div>
                  <div className="px-4 border-b-2 border-gray-300">{x.VALOR}</div>
                  <div className="px-4 border-b-2 border-gray-300">{x.VL_MIN}</div>
                  <div className="px-4 border-b-2 border-gray-300">{x.VL_MAX}</div>
                  <div className="flex flex-wrap items-start pt-2 gap-4 px-4 border-b-2 border-gray-300">
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="10"
                        className="hover:fill-orange-500"
                      >
                        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                      </svg>
                    </button>
              
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="10"
                        className="hover:fill-red-500"
                      >
                        <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )
}