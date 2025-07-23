import React, { useEffect, useState } from "react";
import modbusApi from "../modbusApi";
import correcoes from "./dicionario";

/**
 * Props:
 * - parametrosFormula: array de objetos de parâmetros
 * - modalFormula: boolean para controlar visibilidade
 * - setModalFormula: função para fechar/abrir o modal
 * - fetchParametrosFormula, setIniciar, setStep, pageFormula, totalPagesFormula
 */
export function ModalFormula({
  parametrosFormula = [],
  modalFormula,
  setModalFormula,
  fetchParametrosFormula,
  setIniciar,
  setStep,
  pageFormula,
  totalPagesFormula,
}) {
  const [regs, setRegs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modalFormula) return;

    // Conecta no Modbus ao abrir o modal
    modbusApi
      .post("/connect", { host: "192.168.1.8", port: 502, slaveId: 1 })
      .then(() => {
        // Após conectar, lê registradores de 1 a 100
        return modbusApi.post("/read", {
          type: "holding",
          address: 1,
          length: 100,
        });
      })
      .then((res) => {
        setRegs(res.data.data || []);
        setError("");
      })
      .catch((e) => {
        console.error("Erro Modbus:", e);
        setError("Falha na leitura inicial do Modbus");
      });
  }, [modalFormula]);

  if (!modalFormula) return null;

  const handleReceita = async () => {
    try {
      await Promise.all(
        parametrosFormula.map((el) =>
          modbusApi.post("/write", {
            type: "holding",
            address: Number(el.pontoControle.enderecoCLP) - 1,
            value: el.valor,
          })
        )
      );
      setError("");
    } catch (err) {
      console.error("Erro ao atualizar parâmetros:", err);
      setError("Falha ao atualizar parâmetros.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-neutral-100 p-6 rounded-2xl shadow-lg relative">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Parâmetros da Fórmula</h1>
          <button onClick={() => setModalFormula(false)} aria-label="Fechar" className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24" className="fill-current">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3
                0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3
                0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256
                342.6 150.6z"/>
            </svg>
          </button>
        </header>

        {/* Exibição dos dados lidos */}
        <div className="mb-4">
          <h2 className="font-semibold">Leitura inicial (1–100):</h2>
          <pre className="text-xs bg-gray-50 p-2 rounded h-24 overflow-auto">
            {regs.join(", ")}
          </pre>
        </div>

        {/* Conteúdo paginado */}
        {parametrosFormula.map((row) => (
          <div key={row.id} className="mb-6 bg-white p-6 rounded-lg shadow flex flex-wrap gap-4">
            {Object.entries(row).map(([field, value]) => {
              const key = field.charAt(0).toLowerCase() + field.slice(1);
              if (!["valor", "descricao", "unidade"].includes(key)) return null;

              const widthClass = key === "descricao" ? "w-7/12" : "w-2/12";

              return (
                <div key={field} className={`${widthClass} flex flex-col`}>
                  <label className="text-xs font-bold text-black">{correcoes[key] || key}</label>
                  <input
                    readOnly
                    value={typeof value === "object" ? value.unidade : value}
                    className="mt-1 bg-gray-50 border text-neutral-500 border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              );
            })}
          </div>
        ))}

        {/* Controles de Paginação */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchParametrosFormula(null, Math.max(pageFormula - 1, 0))}
            disabled={pageFormula === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {pageFormula + 1} de {totalPagesFormula}
          </span>
          <button
            onClick={() => fetchParametrosFormula(null, Math.min(pageFormula + 1, totalPagesFormula - 1))}
            disabled={pageFormula + 1 === totalPagesFormula}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>

        {/* Botão de Escrita */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => {
              setModalFormula(false);
              setIniciar(true);
              setStep(1);
              handleReceita();
            }}
            className="bg-green-500 text-white px-6 py-2 rounded hover:brightness-90"
          >
            Carregar Receita
          </button>
        </div>

      </div>
    </div>
  );
}
