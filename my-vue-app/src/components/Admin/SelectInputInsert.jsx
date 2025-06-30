// SelectInputInsert.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export function SelectInputInsert({ table, onChange, param, value, isUnidade = false }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [grandeza, setGrandeza] = useState("");
  const [unidade, setUnidade] = useState("");
  const navigator = useNavigate();
  

  // Busca as opções principais (status, funcao, grandeza, etc)
  useEffect(() => {
    api
      .get(`/${table}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => {
        setOptions(res.data)
        console.log(res.data)
      })
      .catch(err => {
        if (err.response?.status === 401) navigator("/login");
        console.error(`Erro ao buscar opções para ${table}:`, err);
      });
  }, [table, navigator]);

  // Quando seleciona uma grandeza, popula unidadeOptions
  useEffect(() => {
    if (table === "grandeza") {
      const sel = options.find(
        o => o.descricao === grandeza || String(o.id) === String(grandeza)
      );
      setUnidadeOptions(sel?.unidades || []);
    }
  }, [table, options, grandeza]);

  // Valor atual do select (string ou vazio)
  const mainValue = value ?? "";

  const renderMainOptions = () => {
    if (table === "status" || table === "funcao" || table === "nivel" || table === "formula") {
      // enum arrays vindos do back
      return options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ));
    }
    if (table === "grandeza") {
      return options.map(o => (
        <option key={o.id} value={o.descricao}>
          {o.descricao}
        </option>
      ));
    }
    // genérico
    return options.map((o, i) => (
      <option key={i} value={o.descricao || o.descricao}>
        {o.descricao || o.descricao}
      </option>
    ));
  };

  return (
    <div>
      <select
        className="w-11/12 border p-1 rounded"
        defaultValue={""}
        onChange={e => {
          const val = e.target.value;
          if (table === "grandeza") {
            setGrandeza(val);
            onChange({ grandeza: val, unidade: "" });
          } else {
            onChange(val);
          }
        }}
      >
        <option value="" defaultValue="">Selecione</option>
        {renderMainOptions()}
      </select>


      {table === "grandeza" && isUnidade && param && unidadeOptions.length > 0 && (
        <select
          className="w-11/12 border p-1 rounded mt-2"
          value={unidade}
          defaultValue=""
          onChange={e => {
            const u = e.target.value;
            setUnidade(u);
            onChange({ grandeza, unidade: u });
          }}
        >
          <option value="">Selecione a unidade</option>
          {unidadeOptions.map(u => (
            <option key={u.id} value={u.unidade}>
              {u.unidade}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
