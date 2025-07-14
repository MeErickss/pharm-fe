import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export function SelectInputUpdate({ table, onChange, value, param }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/${table.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setOptions(res.data))
    .catch(err => {
      if (err.response?.status === 401) navigate('/login');
      console.error(`Erro ao buscar opções para ${table}:`, err);
    });
  }, [table, navigate]);

  useEffect(() => {
    if (table === "grandeza") {
      const selected = typeof value === 'object' ? value.grandeza : value;
      const found = options.find(
        o => o.descricao === selected || String(o.id) === String(selected)
      );
      setUnidadeOptions(found?.unidades ?? []);
    }
  }, [table, options, value]);

  // Determine the main select's controlled value
  let mainValue = "";
  switch (table) {
    case "grandeza":
      mainValue = typeof value === 'object' ? (value.grandeza ?? "") : (value ?? "");
      break;
    case "status":
      mainValue = typeof value === 'object' ? (value.status ?? "") : (value ?? "");
      break;
    case "funcao":
      mainValue = typeof value === 'object' ? (value.funcao ?? "") : (value ?? "");
      break;
    case "formula":
      mainValue = typeof value === 'object' ? (value.formula ?? "") : (value ?? "");
      break;
    case "pontoControle":
      // Fix: use value.pontoControle instead of formula
      mainValue = typeof value === 'object' ? (value.pontoControle ?? "") : (value ?? "");
      break;
    default:
      mainValue = value ?? "";
  }

  const renderMainOptions = () => {
    if (["status", "funcao", "nivel", "formula"].includes(table)) {
      return options.map((opt, i) => <option key={i} value={opt}>{opt}</option>);
    }
    if (table === "pontoControle") {
      return options.map(o => (
        o.status == "DESLIGADO" &&
        <option key={o.id} value={o.pontoControle}>
          {o.pontoControle}
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
    return options.map((o, i) => (
      <option key={i} value={o.descricao || o}>
        {o.descricao || o}
      </option>
    ));
  };

  return (
    <div>
      <select
        className="w-11/12 border p-1 rounded bg-gray-50 text-neutral-500 border-gray-300"
        value={mainValue}
        onChange={e => {
          const val = e.target.value;
          console.log(`Selecionado em ${table}:`, val);
          if (table === "grandeza" && param) {
            onChange({ grandeza: val, unidade: "" });
          } else {
            onChange(val);
          }
        }}
      >
        <option value="">Selecione</option>
        {renderMainOptions()}
      </select>

      {table === "grandeza" && param && unidadeOptions.length > 0 && (
        <select
          className="w-11/12 border p-1 rounded mt-2 bg-gray-50 text-neutral-500 border-gray-300"
          value={typeof value === 'object' ? (value.unidade || "") : ""}
          onChange={e => {
            const u = e.target.value;
            console.log('Selecionado unidade:', u);
            onChange({ grandeza: mainValue, unidade: u });
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
