import { useState, useEffect } from "react";
import { LogAlarme } from "../components/LogAlarme.jsx";
import api from "../api.js";
import { LogArmazenamento } from "../components/LogArmazenamento.jsx";
import { Distribuicao } from "./images/Distribuicao.jsx";
import { ModalEmergencia } from "../components/ModalEmergencia.jsx";
import correcoes from "../components/dicionario.js";
import React from "react";

export function Armazenamento() {
  const [error, setError] = useState("");

  const [dadosArmazenamento, setDadosArmazenamento] = useState([]);
  const [dadosAlarme, setDadosAlarme] = useState([]);

  const [formula, setFormula] = useState([]);
  const [pageFormula, setPageFormula] = useState(0);
  const [parametrosFormula, setParametrosFormula] = useState([]);
  const [modalFormula, setModalFormula] = useState(false);
  const [totalPagesFormula, setTotalPagesFormula] = useState(0);

  const [pageProd, setPageProd] = useState(0);
  const [pageAlarme, setPageAlarme] = useState(0);

  const [totalPagesProd, setTotalPagesProd] = useState(0);
  const [totalPagesAlarme, setTotalPagesAlarme] = useState(0);

  const [showModalEmergencia, setShowModalEmergencia] = useState(false);

  const [iniciar, setIniciar] = useState(false)
  const [processo, setProcesso] = useState(false)

  const [size] = useState(6);

  // Fetch Log de Produção
  const fetchLogProducao = (pageToLoad = 0) => {
    api
      .get("/logarmazenamento", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: pageToLoad, size },
      })
      .then((response) => {
        setDadosArmazenamento(response.data.content);
        setTotalPagesProd(response.data.page.totalPages);
        setPageProd(response.data.page.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/login");
        console.error("Erro ao buscar log de produção", err);
        setError("Erro ao carregar dados de produção");
      });
  };

  // Fetch Log de Alarmes
  const fetchLogAlarme = (pageToLoad = 0) => {
    api
      .get("/logalarme", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: pageToLoad, size },
      })
      .then((response) => {
        setDadosAlarme(response.data.content);
        setTotalPagesAlarme(response.data.page.totalPages);
        setPageAlarme(response.data.page.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/login");
        console.error("Erro ao buscar log de alarme", err);
        setError("Erro ao carregar dados de alarme");
      });
  };

  // Fetch fórmulas (once)
  useEffect(() => {
    api
      .get("/formula", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setFormula(response.data))
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar fórmulas", err);
        setError("Erro ao carregar fórmulas");
      });
  }, []);

  // Initial logs fetch
  useEffect(() => {
    fetchLogProducao(0);
    fetchLogAlarme(0);
  }, []);

  // ----- Fetch paginado de parâmetros por fórmula -----
  const fetchParametrosFormula = (formulaEnum, pageToLoad = 0) => {
    api
      .get("/parametro/formula", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { formulaEnum, page: pageToLoad, size },
      })
      .then(({ data }) => {
        setParametrosFormula(data.content);
        setPageFormula(data.page.number);
        setTotalPagesFormula(data.page.totalPages);
        setModalFormula(true);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar parâmetros", err);
        setError("Erro ao carregar parâmetros");
      });
  };

  return (
    <main className="grid rounded-xl grid-cols-4 grid-rows-4 gap-4 w-full h-full bg-gray-100">
      <div className="flex flex-col justify-start items-center col-span-2 row-span-3 p-4 bg-white shadow-md rounded-2xl">
        <h1 className="font-bold text-5xl">Distribuição</h1>
        <Distribuicao />
        {iniciar && (
          <div className="grid relative top-[10rem] text-white w-full grid-cols-3">
            <button className="relative bg-green-500 hover:brightness-90 m-auto w-36 h-16 p-4 rounded-lg" onClick={() => setProcesso(true)}>Iniciar</button>
            {processo && (<><button className="relative bg-red-600 hover:brightness-90 m-auto w-36 h-16 p-4 rounded-lg" onClick={() => {setProcesso(false);setIniciar(false)}}>Parar</button>
            <button className="relative bg-orange-500 hover:brightness-90 m-auto w-36 h-16 p-4 rounded-lg" onClick={() => setProcesso(false)}>Reiniciar</button></>)}
          </div>
        )}
      </div>

      <LogArmazenamento
        fetchLogProducao={fetchLogProducao}
        pageProd={pageProd}
        totalPagesProd={totalPagesProd}
        dadosArmazenamento={dadosArmazenamento}
      />

      <LogAlarme
        dadosAlarme={dadosAlarme}
        pageAlarme={pageAlarme}
        fetchLogAlarme={fetchLogAlarme}
        totalPagesAlarme={totalPagesAlarme}
      />

        <div className="grid items-center grid-cols-4 col-span-2 bg-neutral-400 w-full h-full text-white p-4 rounded-2xl gap-4">
          <div className="grid grid-cols-4 w-full h-full col-span-4 bg-neutral-200 text-black rounded">
            <span>Alarme</span>
            <span>Descricao</span>
            <span>Ação</span>
            <span>Fechado Valuvla 2</span>
          </div>
          {!iniciar && formula.map((f) => (
            <button
              key={f}
              onClick={() => fetchParametrosFormula(f)}
              className="bg-blue-500 m-auto w-36 h-16 p-4 rounded-lg"
            >
              Fórmula {correcoes[f]}
            </button>
          ))}

          <button
            className="bg-blue-500 m-auto w-36 h-16 p-4 rounded-lg"
            onClick={() => setShowModalEmergencia((p) => !p)}
          >
            EMERGÊNCIA
          </button>

          {localStorage.getItem('nivel') === "MANUTENCAO" && <button
            className="bg-blue-500 m-auto w-36 h-16 p-4 rounded-lg"
          >
            Modo Manutenção
          </button>}
        </div>


        {modalFormula && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-neutral-100 p-6 rounded-2xl shadow-lg relative">
          <h1><strong>Parametros da Formula param</strong></h1>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" onClick={() => setModalFormula(!modalFormula)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>

            {/* Conteúdo paginado */}
            {parametrosFormula.map((row) => (
              <div
                key={row.id}
                className="mb-6 bg-white p-6 rounded-lg shadow grid grid-cols-3 gap-4"
              >
              {Object.entries(row).map(([field, value]) => (
                  ["valor","descricao","unidade"].includes(field.replace(/([A-Z])/g, " $1")) &&
                  (<div key={field} className={field.replace(/([A-Z])/g, " $1") == "descricao" ? "flex flex-col col-span-3" : field.replace(/([A-Z])/g, " $1") == "valor" ? "flex flex-col col-span-2" : "flex flex-col"}>
                    <label className="text-xs font-bold text-black">
                      <strong>{correcoes[field.replace(/([A-Z])/g, " $1")]}</strong>
                    </label>
                    {<input
                      readOnly
                      value={
                        typeof value === "object"
                          ? value.unidade
                          : value
                      }
                      className="mt-1 bg-gray-50 border text-neutral-500 border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />}
                  </div>)
                ))}
              </div>
            ))}

            {/* Controles de Paginação */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() =>
                  fetchParametrosFormula(
                    // Você pode armazenar a fórmula atual em estado se precisar
                    formula[0],
                    Math.max(pageFormula - 1, 0)
                  )
                }
                disabled={pageFormula === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {pageFormula + 1} de {totalPagesFormula}
              </span>
              <button
                onClick={() =>
                  fetchParametrosFormula(
                    formula[0],
                    Math.min(pageFormula + 1, totalPagesFormula - 1)
                  )
                }
                disabled={pageFormula + 1 === totalPagesFormula}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {setModalFormula(false);setIniciar(true)}}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:brightness-90"
              >
                Carregar Receita
              </button>
            </div>
          </div>
        </div>
      )}


      {showModalEmergencia && (
        <ModalEmergencia
          setShowModalEmergencia={setShowModalEmergencia}
          showModalEmergencia={showModalEmergencia}
        />
      )}
    </main>
  );
}
