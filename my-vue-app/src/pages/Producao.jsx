import { useState, useEffect } from "react";
import { LogAlarme } from "../components/LogAlarme.jsx";
import { LogProducao } from "../components/LogProducao.jsx";
import { Farmacia } from "./images/Farmacia.jsx";
import api from "../api.js";
import { ModalEmergencia } from "../components/ModalEmergencia.jsx";
import correcoes from "../components/dicionario.js";
import { PdfMakerModal } from "../components/PdfMaker.jsx";

export function Producao() {
  const [error, setError] = useState("");

  // Logs de Produção e Alarmes
  const [dadosProd, setDadosProd] = useState([]);
  const [dadosAlarme, setDadosAlarme] = useState([]);
  const [pageProd, setPageProd] = useState(0);
  const [totalPagesProd, setTotalPagesProd] = useState(0);
  const [pageAlarme, setPageAlarme] = useState(0);
  const [totalPagesAlarme, setTotalPagesAlarme] = useState(0);

  // Fórmulas e Parâmetros
  const [formula, setFormula] = useState([]);
  const [parametrosFormula, setParametrosFormula] = useState([]);
  const [pageFormula, setPageFormula] = useState(0);
  const [totalPagesFormula, setTotalPagesFormula] = useState(0);

  // Modais
  const [modalFormula, setModalFormula] = useState(false);
  const [showModalEmergencia, setShowModalEmergencia] = useState(false);

  const [showModalPdf, setShowModalPdf] = useState(false);


  const [iniciar, setIniciar] = useState(false)
  const [processo, setProcesso] = useState(false)

  // Tamanho da página
  const [size] = useState(6);

  // ----- Fetch para Log de Produção -----
  const fetchLogProducao = (pageToLoad = 0) => {
    api
      .get("/logproducao", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: pageToLoad, size },
      })
      .then(({ data }) => {
        setDadosProd(data.content);
        console.log(data.content)
        setTotalPagesProd(data.page.totalPages);
        setPageProd(data.page.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar log de produção", err);
        setError("Erro ao carregar dados de produção");
      });
  };

  // ----- Fetch para Log de Alarmes -----
  const fetchLogAlarme = (pageToLoad = 0) => {
    api
      .get("/logalarme", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: pageToLoad, size },
      })
      .then(({ data }) => {
        setDadosAlarme(data.content);
        setTotalPagesAlarme(data.page.totalPages);
        setPageAlarme(data.page.number);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar log de alarme", err);
        setError("Erro ao carregar dados de alarme");
      });
  };

  // ----- Fetch de fórmulas disponíveis -----
  useEffect(() => {
    api
      .get("/formula", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        setFormula(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar fórmulas", err);
        setError("Erro ao carregar fórmulas");
      });
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

  // Carrega logs ao montar
  useEffect(() => {
    fetchLogProducao(0);
    fetchLogAlarme(0);
  }, []);

  return (
    <main className="grid rounded-xl grid-cols-4 grid-rows-4 gap-4 w-full h-full bg-gray-100">
      {/* Farmácia */}
      <div className="flex flex-col justify-start items-center col-span-2 row-span-3 p-4 bg-white shadow-md rounded-2xl">
        <h1 className="font-bold text-5xl">Farmácia</h1>
        <Farmacia />
        {iniciar && (
          <div className="grid justify-center items-center relative top-[10rem] text-white w-full grid-cols-4">
            <button className="relative bg-green-500 hover:brightness-125 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => setProcesso(true)}>Iniciar</button>
            {processo && (<><button className="relative bg-red-500 hover:brightness-125 text-white w-7/12 mx-16 h-8 px-3 py-1 rounded-lg" onClick={() => {setProcesso(false);setIniciar(false)}}>Parar</button>
            <button className="relative bg-indigo-600 hover:brightness-125 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={()=>setShowModalPdf(true)}>Gerar PDF</button>
            <button className="relative bg-orange-500 hover:brightness-125 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => setProcesso(false)}>Reiniciar</button></>)}

          </div>
        )}
      </div>

      {/* Log de Produção */}
      <LogProducao
        dadosProd={dadosProd}
        pageProd={pageProd}
        totalPagesProd={totalPagesProd}
        fetchLogProducao={fetchLogProducao}
      />

      {/* Log de Alarmes */}
      <LogAlarme
        dadosAlarme={dadosAlarme}
        pageAlarme={pageAlarme}
        totalPagesAlarme={totalPagesAlarme}
        fetchLogAlarme={fetchLogAlarme}
      />

      {/* Grid de Botões de Fórmula ou Modal */}
        <div className="grid items-center grid-cols-4 grid-rows-2 col-span-2 bg-neutral-400 w-full h-full text-white p-4 rounded-2xl gap-4">
          <div className="grid grid-cols-4 w-full h-full col-span-4 bg-neutral-200 text-black rounded">
            <span className="text-red-500">Alarme: ATIVADO</span>
            <span>Falha na abertura da Valvula V2</span>
            <span>Detetização</span>
            <span>Fechado Valuvla 2</span>
          </div>
          {!iniciar && formula.map((f) => (
            <button
              key={f}
              onClick={() => fetchParametrosFormula(f)}
              className="bg-blue-500 hover:brightness-125 text-white mx-6 h-8 px-3 py-1 rounded-lg"
            >
              Fórmula {correcoes[f]}
            </button>
          ))}

          <button
            className="bg-blue-500 hover:brightness-125 text-white mx-6 h-8 px-3 py-1 rounded-lg"
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
          <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-neutral-100 p-6 rounded-2xl shadow-lg relative">
          <h1><strong>Parametros da Formula param</strong></h1>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" onClick={() => setModalFormula(!modalFormula)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>

            {/* Conteúdo paginado */}
            {parametrosFormula.map((row) => (
              <div
                key={row.id}
                className="mb-6 bg-white p-6 rounded-lg shadow grid grid-cols-4 gap-4"
              >
                {Object.entries(row).map(([field, value]) => (
                  ["valor","descricao","unidade"].includes(field.replace(/([A-Z])/g, " $1")) &&
                  (<div key={field} className={field.replace(/([A-Z])/g, " $1") == "descricao" ? "flex flex-col col-span-3" : field.replace(/([A-Z])/g, " $1") == "valor" ? "flex flex-col w-1/3" : "w-1/3 flex flex-col"}>
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

      {/* Modal de Emergência */}
      {showModalEmergencia && (
        <ModalEmergencia
          setShowModalEmergencia={setShowModalEmergencia}
          showModalEmergencia={showModalEmergencia}
        />
      )}

      {showModalPdf && (
        <PdfMakerModal
          setShowModalPdf={setShowModalPdf}
        />
      )}
    </main>
  );
}