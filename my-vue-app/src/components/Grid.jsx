import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";// importe também closeModal se for necessário

export function Grid({
  dados,
  dadosLen,
  funcao
}) {
  const [valores, setValores] = useState({});
  const navigate = useNavigate();

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
      await api.put("/parametro", body, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `
              minmax(3rem, auto)
              minmax(35rem, 1fr)
              ${Array.from({ length: dadosLen - 2 })
                .map(() => "minmax(5rem, 1fr)")
                .join(" ")}`,
          }}
        >
          {Object.keys(dados[0]).map((key) => (
            <div key={key} className="px-2">
              {key[0].toUpperCase() + key.substring(1)}
            </div>
          ))}
        </div>
      )}

      {dados.map((row) => (
        <div
          key={row.id}
          className="grid text-sm p-3 px-2 border-b"
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
              <div key={idx} className="px-2">
                {value ?? "—"}
              </div>
            ) : (
              <div key={idx} className="relative">
                <input
                  type="number"
                  className="w-8/12 px-2 outline-none border-b-2 border-orange-400"
                  value={valores[row.id] ?? ""}
                  min={row.vlMin}
                  max={row.vlMax}
                  onChange={(e) => handleChangeValor(row.id, e.target.value)}
                />
                <button
                  onClick={() => handleSubmit(row)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 w-4/12 py-1 text-white rounded-l"
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
