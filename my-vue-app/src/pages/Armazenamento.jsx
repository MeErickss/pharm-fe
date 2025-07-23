import { useState, useEffect } from "react";
import { LogAlarme } from "../components/LogAlarme.jsx";
import api from "../api.js";
import { LogArmazenamento } from "../components/LogArmazenamento.jsx";
import { Distribuicao } from "./images/Distribuicao.jsx";
import { ModalFormula } from "../components/modalFormula.jsx";
import { ModalEmergencia } from "../components/ModalEmergencia.jsx";
import correcoes from "../components/dicionario.js";
import React from "react";
import { Steps } from "antd"
import { PdfMakerModal } from "../components/PdfMaker.jsx";

export function Armazenamento() {

  const { Step } = Steps
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
  
  const [showModalPdf, setShowModalPdf] = useState(false);

  const [iniciar, setIniciar] = useState(false)
  const [processo, setProcesso] = useState(false)


  const [step, setStep] = useState(-1)

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
          <div className="grid justify-center items-center relative top-[10rem] text-white w-full grid-cols-4">
            <button className="relative bg-green-600 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => {setProcesso(true);setStep(1)}}>Iniciar</button>
            {processo && (<><button className="relative bg-red-600 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => {setProcesso(false);setIniciar(false);setStep(-1)}}>Parar</button>
            <button className="relative bg-indigo-600 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={()=> {setShowModalPdf(true);setStep(2)}}>Gerar PDF</button>
            <button className="relative bg-orange-500 hover:brightness-90 text-white mx-16 h-8 px-3 w-7/12 py-1 rounded-lg" onClick={() => {setProcesso(false);setStep(0)}}>Reiniciar</button></>)}
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

        <div className="grid items-center grid-cols-4 grid-rows-2 col-span-2 bg-neutral-400 w-full h-[15.7rem] text-white p-4 rounded-2xl gap-4">
          <div className="grid grid-cols-4 grid-rows-2 w-full h-full col-span-4 bg-neutral-200 text-black rounded">
            <span>Alarme</span>
            <span>Descricao</span>
            <span>Ação</span>
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
            className="bg-blue-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded-lg"
          >
            Modo Manutenção
          </button>}
        </div>


        {modalFormula && <ModalFormula  parametrosFormula={parametrosFormula} modalFormula={modalFormula} setModalFormula={setModalFormula} fetchParametrosFormula={fetchParametrosFormula} setIniciar={setIniciar} setStep={setStep} pageFormula={pageFormula} totalPagesFormula={totalPagesAlarme} />}


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
