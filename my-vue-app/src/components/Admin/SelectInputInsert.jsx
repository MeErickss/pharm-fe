import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export function SelectInputInsert({ table, onChange, param, value, isUnidade = false }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [grandeza, setGrandeza] = useState("");
  const [unidade, setUnidade] = useState("");
  const navigate = useNavigate();

  console.log(value)

  // Fetch main options based on the table
  useEffect(() => {
    api
      .get(`/${table.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => {setOptions(res.data)})
      .catch(err => {
        if (err.response?.status === 401) navigate("/login");
        console.error(`Error fetching options for ${table}:`, err);
      });
  }, [table, navigate]);

  // Populate unidadeOptions when a grandeza is selected
  useEffect(() => {
    if (table === "grandeza") {
      const selected = options.find(
        o => o.descricao === grandeza || String(o.id) === String(grandeza)
      );
      setUnidadeOptions(selected?.unidades || []);
    }
  }, [table, options, grandeza]);


  // Render options based on table type
  const renderMainOptions = () => {
    switch (table) {
      case "status":
      case "clpTipo":
      case "tipoUso":
      case "offset":
      case "funcao":
      case "nivel":
      case "formula":
        return options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ));

      case "grandeza":
        return options.map(o => (
          <option key={o.id} value={o.descricao}>
            {o.descricao}
          </option>
        ));

      case "pontoControle":
        return options.map(o => (
          o.status == "DESLIGADO" && (
          <option key={o.id} value={o.pontoControle}>
            {o.pontoControle}
          </option>
          )
        ));

      default:
        return options.map(o => (
          <option key={o.id || o} value={o.descricao || o}>
            {o.descricao || o}
          </option>
        ));
    }
  };

  return (
    <div>
      <select
        className="w-11/12 border px-3 py-2 p-1 mt-1 rounded bg-gray-50 text-neutral-500 border-gray-300"
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
        <option value={null}>Selecione</option>
        {renderMainOptions()}
      </select>

      {table === "grandeza" && isUnidade && param && unidadeOptions.length > 0 && (
        <select
          className="w-11/12 border p-1 rounded mt-2 bg-gray-50 text-neutral-500 border-gray-300"
          value={unidade}
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
