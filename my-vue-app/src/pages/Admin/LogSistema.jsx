// src/LogsDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { LogsCarousel } from "../../components/LogsCarousel";
import api from "../../api";
export function LogSistema() {
  // ----- Estado para cada log -----
  const [dadosProd, setDadosProd] = useState([]);
  const [pageProd, setPageProd] = useState(0);
  const [totalPagesProd, setTotalPagesProd] = useState(1);

  const [dadosArmazenamento, setDadosArmazenamento] = useState([]);
  const [pageArmazenamento, setPageArmazenamento] = useState(0);
  const [totalPagesArmazenamento, setTotalPagesArmazenamento] = useState(1);

  const [dadosAlarme, setDadosAlarme] = useState([]);
  const [pageAlarme, setPageAlarme] = useState(0);
  const [totalPagesAlarme, setTotalPagesAlarme] = useState(1);

  const size = 10; // itens por página

  // ----- Funções de fetch (memoizadas) -----
  const fetchLogProducao = useCallback((newPage) => {
    if (newPage < 0 || newPage >= totalPagesProd) return;
    api
      .get("/logproducao", { params: { page: newPage, size } })
      .then(({ data: page }) => {
        setDadosProd(page.content);
        setPageProd(page.page.number);
        setTotalPagesProd(page.page.totalPages);
        console.log(page)
        console.log("data")
      })
      .catch(console.error);
  }, [totalPagesProd]);

  const fetchLogArmazenamento = useCallback((newPage) => {
    if (newPage < 0 || newPage >= totalPagesArmazenamento) return;
    api
      .get("/logarmazenamento", { params: { page: newPage, size } })
      .then(({ data: page }) => {
        setDadosArmazenamento(page.content);
        setPageArmazenamento(page.page.number);
        setTotalPagesArmazenamento(page.page.totalPages);
      })
      .catch(console.error);
  }, [totalPagesArmazenamento]);

  const fetchLogAlarme = useCallback((newPage) => {
    if (newPage < 0 || newPage >= totalPagesAlarme) return;
    api
      .get("/logalarme", { params: { page: newPage, size } })
      .then(({ data: page }) => {
        setDadosAlarme(page.content);
        setPageAlarme(page.page.number);
        setTotalPagesAlarme(page.page.totalPages);
      })
      .catch(console.error);
  }, [totalPagesAlarme]);

  // ----- Carrega a primeira página de cada log ao montar -----
  useEffect(() => { fetchLogProducao(0); }, [fetchLogProducao]);
  useEffect(() => { fetchLogArmazenamento(0); }, [fetchLogArmazenamento]);
  useEffect(() => { fetchLogAlarme(0); }, [fetchLogAlarme]);

  return (
    <div className="w-full rounded h-full bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Logs do Sistema</h2>
      <LogsCarousel
        // Produção
        fetchLogProducao={fetchLogProducao}
        pageProd={pageProd}
        totalPagesProd={totalPagesProd}
        dadosProd={dadosProd}

        // Armazenamento
        fetchLogArmazenamento={fetchLogArmazenamento}
        pageArmazenamento={pageArmazenamento}
        totalPagesArmazenamento={totalPagesArmazenamento}
        dadosArmazenamento={dadosArmazenamento}

        // Alarme
        fetchLogAlarme={fetchLogAlarme}
        pageAlarme={pageAlarme}
        totalPagesAlarme={totalPagesAlarme}
        dadosAlarme={dadosAlarme}
      />
    </div>
  );
}
