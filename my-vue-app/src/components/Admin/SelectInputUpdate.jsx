// SelectInputUpdate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export function SelectInputUpdate({ table, onChange, value, param }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    api.get(`/${table}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {setOptions(res.data); console.log(response.data)})
    .catch(err => {
      if (err.response?.status === 401) navigator('/login');
      console.error(`Erro ao buscar opções para ${table}:`, err);
    });
  }, [table, navigator]);

  useEffect(() => {
    if (table === "grandeza") {
      const selected = typeof value === 'object' ? value.grandeza : value;
      const found = options.find(o => o.descricao === selected || String(o.id) === String(selected));
      setUnidadeOptions(found?.unidades ?? []);
    }
  }, [table, options, value]);

  let mainValue = "";
  if (table === "grandeza") {
    mainValue = typeof value === 'object' ? (value.grandeza ?? "") : (value ?? "");
  } else if (table === "status") {
    mainValue = typeof value === 'object' ? (value.status ?? "") : (value ?? "");
  } else {
    mainValue = value ?? "";
  }

  const renderMainOptions = () => {
    if (table === "status") {
      return options.map((st, i) => <option key={i} value={st}>{st}</option>);
    }
    if (table === "grandeza") {
      return options.map(o => <option key={o.id} value={o.descricao}>{o.descricao}</option>);
    }
    return options.map((o, i) => (
      <option key={i} value={o.descricao}>
        {o.descricao}
      </option>
    ));
  };

  return (
    <div>
      <select
        className="w-11/12 border p-1 rounded"
        value={mainValue}
        onChange={e => {
          const val = e.target.value;
          console.log('Selecionado em', table, ':', val);
          if (table === "grandeza" && param) {
            onChange({ grandeza: val, unidade: "" });
          } else if (table === "status") {
            onChange(val);
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
          className="w-11/12 border p-1 rounded mt-2"
          value={typeof value === 'object' ? (value.unidade || "") : ""}
          onChange={e => {
            const u = e.target.value;
            console.log('Selecionado unidade:', u);
            onChange({ grandeza: mainValue, unidade: u });
          }}
        >
          <option value="">Selecione a unidade</option>
          {unidadeOptions.map(u => (
            <option key={u.id} value={u.unidade}>{u.unidade}</option>
          ))}
        </select>
      )}
    </div>
  );
}
