import { useState, useEffect } from "react";
import imagem from "./images/p.png";
import api from "../api.js";

export function Producao() {
  const [error, setError] = useState("");

  const [dadosProd, setDadosProd] = useState([]);
  const [dadosAlarme, setDadosAlarme] = useState([]);

  const [pageProd, setPageProd] = useState(0);
  const [pageAlarme, setPageAlarme] = useState(0);

  const [totalPagesProd, setTotalPagesProd] = useState(0);
  const [totalPagesAlarme, setTotalPagesAlarme] = useState(0);

  const [size] = useState(6); // tamanho da página

  // ----- Fetch para Log de Produção -----
  const fetchLogProducao = (pageToLoad = 0) => {
    api
      .get("/logproducao", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: pageToLoad,
          size: size,
        },
      })
      .then((response) => {
        setDadosProd(response.data.content);
        setTotalPagesProd(response.data.totalPages);
        setPageProd(response.data.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigator("/login");
        }
        console.error("Erro ao buscar log de produção", err);
        setError("Erro ao carregar dados de produção");
      });
  };

  // ----- Fetch para Log de Alarmes -----
  const fetchLogAlarme = (pageToLoad = 0) => {
    api
      .get("/logalarme", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: pageToLoad,
          size: size,
        },
      })
      .then((response) => {
        setDadosAlarme(response.data.content);
        setTotalPagesAlarme(response.data.totalPages);
        setPageAlarme(response.data.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigator("/login");
        }
        console.error("Erro ao buscar log de alarme", err);
        setError("Erro ao carregar dados de alarme");
      });
  };

  useEffect(() => {
    fetchLogProducao(0);
    fetchLogAlarme(0);
  }, []);

  return (
    <main className="grid grid-cols-4 grid-rows-4 gap-4 w-full h-full bg-gray-100">
      <div className="flex flex-col justify-between items-center col-span-2 row-span-3 p-4 bg-white shadow-md rounded-2xl">
        <img width={1000} src={imagem} alt="Produção" />
      </div>

      {/* Log de Produção */}
      <div className="col-span-2 row-span-2 bg-neutral-400 rounded-2xl">
        <div className="w-full flex flex-col items-center p-4">
          {dadosProd.map((item, index) => (
            <div key={index} className="w-[56rem] h-[3.8rem] bg-gray-200 my-1 p-2 rounded">
              <p className="text-sm font-medium">{item.descricao}</p>
              <p className="text-xs text-gray-600">{item.dataHora}</p>
              <p className="text-xs text-gray-800">Status: {item.status}</p>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => fetchLogProducao(pageProd - 1)}
              disabled={pageProd === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm mt-1">
              <strong>Página {pageProd + 1} de {totalPagesProd}</strong>
            </span>
            <button
              onClick={() => fetchLogProducao(pageProd + 1)}
              disabled={pageProd + 1 >= totalPagesProd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* Log de Alarmes */}
      <div className="flex flex-wrap col-span-2 row-span-2 p-4 bg-neutral-400 rounded-2xl">
        <div className="flex flex-col items-center">
          {dadosAlarme.map((item, index) => (
            <div key={index} className="w-[56rem] h-[3.8rem] bg-gray-200 my-1 p-2 rounded">
              <p className="text-sm font-medium">{item.descricao}</p>
              <p className="text-xs text-gray-600">{item.dataHora}</p>
              <p className="text-xs text-gray-800">Status: {item.status}</p>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => fetchLogAlarme(pageAlarme - 1)}
              disabled={pageAlarme === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm mt-1">
              <strong>Página {pageAlarme + 1} de {totalPagesAlarme}</strong>
            </span>
            <button
              onClick={() => fetchLogAlarme(pageAlarme + 1)}
              disabled={pageAlarme + 1 >= totalPagesAlarme}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-2 bg-black w-full h-full text-white p-4 rounded-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora blanditiis, illum, eligendi quis dignissimos sed magni quam dolores ratione eveniet molestias perferendis quae facilis praesentium deserunt ea mollitia totam minus.
      </div>
    </main>
  );
}
