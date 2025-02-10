import { useState, useEffect } from "react";
import axios from "axios";

export function ParametersProduction() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [editar, setEditar] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/parametros_producao")
      .then((response) => {
        console.log("Dados recebidos:", response.data);
        setDados(response.data);

        const estadoInicial = response.data.map((x) => ({
          ID: x.ID,
          EDITAR: false,
        }));
        setEditar(estadoInicial);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

  const toggleEditar = (id) => {
    setEditar((prev) =>
      prev.map((item) =>
        item.ID === id ? { ...item, EDITAR: !item.EDITAR } : item
      )
    );
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
        <div className="grid grid-cols-[3rem_30rem_5rem_5rem_5rem_8rem_8rem_5rem] bg-gray-200 font-semibold text-gray-700 p-3 border-b">
          <div>ID</div>
          <div>Parametro</div>
          <div>Tipo</div>
          <div>Unidade</div>
          <div>Valor</div>
          <div>Valor Minimo</div>
          <div>Valor Maximo</div>
          <div>Ações</div>
        </div>


        {dados.map((x) => {
          const estadoEdicao = editar.find((item) => item.ID === x.ID)?.EDITAR;

          return (
            <div key={x.ID} className="grid grid-cols-[3rem_30rem_5rem_5rem_5rem_8rem_8rem_5rem] p-3 border-b items-center">
              {estadoEdicao ? (
                <>
                  <div>{x.ID}</div>
                  <div>{x.PARAMETRO}</div>
                  <div><input type="text" className="w-full" defaultValue={x.TIPO} /></div>
                  <div><input type="text" className="w-full" defaultValue={x.UNID} /></div>
                  <div><input type="text" className="w-full" defaultValue={x.VALOR} /></div>
                  <div>{x.VL_MIN}</div>
                  <div>{x.VL_MAX}</div>
                </>
              ) : (
                <>
                  <div>{x.ID}</div>
                  <div>{x.PARAMETRO}</div>
                  <div>{x.TIPO}</div>
                  <div>{x.UNID}</div>
                  <div>{x.VALOR}</div>
                  <div>{x.VL_MIN}</div>
                  <div>{x.VL_MAX}</div>
                </>
              )}
                <button onClick={() => toggleEditar(x.ID)}>
                  {estadoEdicao ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 448 512"
                      className="hover:fill-green-500"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="10"
                      className="hover:fill-orange-500"
                    >
                      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                    </svg>
                  )}
                </button>
              </div>
          );
        })}
      </div>
    </div>
  );
}
