import { useState, useEffect } from "react";
import { LogAlarme } from "../components/LogAlarme.jsx";
import { LogProducao } from "../components/LogProducao.jsx";
import { Farmacia } from "./images/Farmacia.jsx";
import api from "../api.js";
import { ModalEmergencia } from "../components/ModalEmergencia.jsx";
import correcoes from "../components/dicionario.js";
import { PdfMakerModal } from "../components/PdfMaker.jsx";
import { ModalFormula } from "../components/modalFormula.jsx";
import { Steps } from "antd";
import "antd/dist/reset.css";


export function Producao() {
  const [error, setError] = useState("");
  const { Step } = Steps;


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

  const [step, setStep] = useState(-1)

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
            <button className="relative bg-green-500 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => {setProcesso(true);setStep(1)}}>Iniciar</button>
            {processo && (<><button className="relative bg-red-500 hover:brightness-90 text-white w-7/12 mx-16 h-8 px-3 py-1 rounded-lg" onClick={() => {setProcesso(false);setIniciar(false);setStep(-1)}}>Parar</button>
            <button className="relative bg-indigo-600 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={()=> {setShowModalPdf(true);setStep(2)}}>Gerar PDF</button>
            <button className="relative bg-orange-500 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => {setProcesso(false);setStep(0)}}>Reiniciar</button></>)}
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
        <div className="grid items-center grid-cols-4 grid-rows-2 col-span-2 bg-neutral-400 w-full h-[15.7rem] text-white p-4 rounded-2xl gap-4">
          <div className="grid grid-cols-4 grid-rows-2 w-full h-full col-span-4 bg-neutral-200 text-black rounded">
            <span className="text-red-500">Alarme: ATIVADO</span>
            <span>Abertura Valvula V2</span>
            <span>Detetização</span>
            <span>Fechado Valuvla 2</span>
                  <div className="col-span-4 -mt-[1.5rem]" style={{ padding: 24 }}>
                    <Steps current={step}>
                      <Step title="Inicio"/>
                      <Step title="Processo"/>
                      <Step title="Concluído"/>
                    </Steps>
                  </div>
          </div>
          {!iniciar && formula.map((f) => (
            <button
              key={f}
              onClick={() => fetchParametrosFormula(f)}
              className="bg-blue-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded-lg"
            >
              Fórmula {correcoes[f]}
            </button>
          ))}

          <button
            className="bg-blue-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded-lg"
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


        {modalFormula &&  <ModalFormula  parametrosFormula={parametrosFormula} modalFormula={modalFormula} setModalFormula={setModalFormula} fetchParametrosFormula={fetchParametrosFormula} setIniciar={setIniciar} setStep={setStep} pageFormula={pageFormula} totalPagesFormula={totalPagesAlarme} />}

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
          setStep={setStep}
          dados={parametrosFormula}
        />
      )}
    </main>
  );
}