import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";// importe também closeModal se for necessário
import correcoes from "./dicionario";

export function Grid({
  dados,
  dadosLen,
  funcao
}) {
  const [valores, setValores] = useState({});
  const navigate = useNavigate();

  const style = {
    "UM":"w-10/12 text-white text-center font-bold rounded-lg bg-cyan-300 px-2",
    "DOIS":"w-10/12 text-white text-center font-bold rounded-lg bg-teal-600 px-2",
    "TRES":"w-10/12 text-white text-center font-bold rounded-lg bg-violet-600 px-2",
    "ATIVO":"w-10/12 text-white text-center font-bold rounded-lg bg-green-400 px-2",
    "BLOQUEADO":"w-10/12 text-white text-center font-bold rounded-lg bg-red-600 px-2",
    "INATIVO":"w-10/12 text-white text-center font-bold rounded-lg bg-yellow-400 px-2",
    "PRODUCAO":"w-10/12 text-white text-center font-bold rounded-lg bg-gray-300 px-2",
    "ARMAZENAMENTO":"w-10/12 text-[0.72rem] text-white text-center font-bold rounded-lg bg-amber-950 px-2",
  }

  useEffect(() => {
    const init = {};
    dados.forEach((row) => {
      const col2 = Object.values(row)[2];
      init[row.id] = col2 != null ? String(col2) : "";
    });
    setValores(init);
  }, [dados]);

  const handleChangeValor = (rowId, novoValor) => {
    setValores((prev) => ({
      ...prev,
      [rowId]: novoValor,
    }));
  };

  // Agora recebe a linha inteira e usa valores[row.id]
  const handleSubmit = async (row) => {
    const novoValor = Number(valores[row.id] ?? row.valor);
    const body = {
      id: row.id,
      descricao: row.descricao,
      vlmin: Number(row.vlMin),
      vlmax: Number(row.vlMax),
      valor: novoValor,
      statusenum: row.status,
      grandezaDesc: row.grandeza,
      unidadeDesc: row.unidade,
      funcao: funcao
    };

    console.log("Enviando body:", body);

    try {
    await api.put("/parametro", body,         {
          params: {
            userLogin: localStorage.getItem("login")
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      alert("✅ Registro atualizado com sucesso!");
      // closeModal(); // se tiver modal, chame aqui
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      console.error("❌ Erro ao atualizar registro:", error);
      alert("Erro ao atualizar registro. Verifique os dados e tente novamente!");
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
      {dados.length > 0 && (
        <div
          className="grid bg-gray-200 text-sm font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `
              minmax(3rem, auto)
              minmax(35rem, 1fr)
              ${Array.from({ length: dadosLen - 2 })
                .map(() => "minmax(5rem, 1fr)")
                .join(" ")}`,
          }}
        >
          {Object.entries(dados[0]).map(([campo, valor]) => (
            <div key={campo} className="px-2">
              {correcoes[campo]}
            </div>
          ))}
        </div>
      )}

      {dados.map((row) => (
        <div
          key={row.id}
          className="grid text-xs p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `
              minmax(3rem, auto)
              minmax(35rem, 1fr)
              ${Array.from({ length: dadosLen - 2 })
                .map(() => "minmax(4rem, 1fr)")
                .join(" ")}`,
          }}
        >
          {Object.values(row).map((value, idx) =>
            idx !== 2 ? (
              <div key={idx} className={value in style ? style[value] : value == null ? "px-2 bg-red-500 rounded-lg text-center text-white font-bold w-10/12" : "px-2"}>
                {value ?? <strong>INDEFINIDO</strong>}
              </div>
            ) : (
              <div key={idx} className="relative">
                <input
                  type="number"
                  className="w-8/12 px-2 outline-none border-b-2 border-orange-400 "
                  value={valores[row.id] ?? ""}
                  min={row.vlMin}
                  max={row.vlMax}
                  onChange={(e) => handleChangeValor(row.id, e.target.value)}
                />
                <button
                  onClick={() => handleSubmit(row)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 hover:brightness-90 w-4/12 text-sm text-white rounded-r-lg"
                >
                  Editar
                </button>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
