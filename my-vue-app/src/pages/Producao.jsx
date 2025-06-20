import { useState, useEffect } from "react";
import { LogAlarme } from "../components/LogAlarme.jsx";
import { LogProducao } from "../components/LogProducao.jsx";
import { Farmacia } from "./images/Farmacia.jsx";
import api from "../api.js";
import { ModalEmergencia } from "../components/ModalEmergencia.jsx";

export function Producao() {
  const [error, setError] = useState("");

  const [dadosProd, setDadosProd] = useState([]);
  const [dadosAlarme, setDadosAlarme] = useState([]);

  const [pageProd, setPageProd] = useState(0);
  const [pageAlarme, setPageAlarme] = useState(0);

  const [totalPagesProd, setTotalPagesProd] = useState(0);
  const [totalPagesAlarme, setTotalPagesAlarme] = useState(0);
  const [showModalEmergencia, setShowModalEmergencia] = useState(false)

  const [size] = useState(5); // tamanho da página

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
        <Farmacia/>
      </div>

      {/* Log de Produção */}
      <LogProducao fetchLogProducao={fetchLogProducao} pageProd={pageProd} totalPagesProd={totalPagesProd} dadosProd={dadosProd}  />

      <LogAlarme dadosAlarme={dadosAlarme} pageAlarme={pageAlarme} fetchLogAlarme={fetchLogAlarme} totalPagesAlarme={totalPagesAlarme}/>

      <div className="col-span-2 bg-black w-full h-full text-white p-4 rounded-2xl">
        <button onClick={() => setShowModalEmergencia(!showModalEmergencia)}>EMERGENCIA</button>
      </div>
      {showModalEmergencia && ( <ModalEmergencia setShowModalEmergencia={setShowModalEmergencia} showModalEmergencia={showModalEmergencia} /> )}
    </main>
  );
}
