import { CheckOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import api from "../api";

export function Grid({
  dados,
  dadosLen,
  setDados,
  body
}) {
  // Em vez de um único `valor`, vamos criar um objeto cujo chave será row.id
  const [valores, setValores] = useState({});

  // Sempre que `dados` mudar, inicializamos cada row.id com o valor original da coluna 2
  useEffect(() => {
    const init = {};
    dados.forEach(row => {
      // pega o valor na posição idx === 2 (terceira coluna)
      const col2 = Object.values(row)[2];
      init[row.id] = col2 != null ? String(col2) : "";
    });
    setValores(init);
  }, [dados]);

  const handleChangeValor = async (rowId, novoValor) => {
    setValores(prev => ({
      ...prev,
      [rowId]: novoValor
    }));
  };

  const handleSubmit = async (rowId) => {

    body = {
      id:dados[rowId].id,
      descricao:dados[rowId].descricao,
      vlmin:Number(dados[rowId].vlMin),
      vlmax:Number(dados[rowId].vlMax),
      valor:Number(dados[rowId].valor),
      statusenum:dados[rowId].status,
      grandezaDesc:dados[rowId].grandeza,
      unidadeDesc:dados[rowId].unidade,
      funcao: dados[rowId].funcao
    }

    console.log(body)
    
    try {
      await api.put("/parametro", body, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Registro inserido com sucesso!")
          setDados(prevDados =>
          prevDados.map(item =>
            item.id === rowId
              ? { ...item, valor: Number(valores[rowId]) } // atualiza só o campo modificado
              : item
          ))
    } catch (error) {
      if (error.response?.status === 401) navigator("/login");
      console.error("❌ Erro ao inserir registro:", error);
      alert("Erro ao inserir registro. Verifique os dados e tente novamente!");
    }
  //   finally{
  //     window.location.reload()
  // }
  };

  return (
    <div>
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
      {dados.length > 0 && (
        <div
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `
              minmax(3rem, auto)
              minmax(24.5rem, 1fr)
              ${Array.from({ length: dadosLen - 1 })
                .map(() => 'minmax(2rem, 1fr)')
                .join(' ')}`
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
              minmax(25rem, 1fr)
              ${Array.from({ length: dadosLen - 1 })
                .map(() => 'minmax(4rem, 1fr)')
                .join(' ')}`
          }}
        >
          {Object.values(row).map((value, idx) =>
            idx !== 2 ? (
              <div key={idx} className="px-2">
                {value}
              </div>
            ) : (
              <>
              <input
                type="number"
                key={row}
                className="px-2 outline-none border-b-2 border-orange-400"
                min={row.vlMin}
                max={row.vlMax}
                value={valores[row.id] ?? ""}
                onChange={(e) => handleChangeValor(row.id, e.target.value)}
              />
                <button onClick={()=>handleSubmit(row.id)} className="flex flex-row w-[6rem] p-2 bg-blue-600 hover:brightness-125 text-white gap-2 rounded">
                  Confirmar
                  <CheckOutlined />
                </button>
              </>
            )
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
