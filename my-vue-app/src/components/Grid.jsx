import { Tooltip } from "antd";
import React, { useState, useEffect } from "react";

export function Grid({
  dados,
  dadosLen,
  tooltipVisible,
  setTooltipVisible,
  onEdit,
  onDelete,
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

  const handleMouseEnter = (type, id) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: id }));
  };

  const handleMouseLeave = (type) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: null }));
  };

  // Ao alterar o input de uma linha, atualizamos apenas aquela chave em `valores`
  const handleChangeValor = (rowId, novoValor) => {
    setValores(prev => ({
      ...prev,
      [rowId]: novoValor
    }));
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
      {dados.length > 0 && (
        <div
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `
              minmax(3rem, auto)
              minmax(24.5rem, 1fr)
              ${Array.from({ length: dadosLen - 2 })
                .map(() => 'minmax(4rem, 1fr)')
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
              ${Array.from({ length: dadosLen - 2 })
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
              <input
                type="number"
                key={idx}
                className="px-2 outline-none border-b-2 border-orange-400"
                // Use o estado específico para esta linha
                value={valores[row.id] ?? ""}
                onChange={(e) => handleChangeValor(row.id, e.target.value)}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
}
