// SelectInputUpdate.jsx
import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputGeneric } from "./SelectInputGeneric";

export function SelectInputUpdate({ table, onChange, value = {} }) {
  const resourceMap = {
    grandeza: "grandeza",
    unidade: "unidade",
    status: "status",
    funcao: "funcao",
  };
  const endpoint = resourceMap[table] || table;
  const isCascade = table === "grandeza";

  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [grandeza, setGrandeza] = useState(isCascade ? value.grandeza || "" : "");
  const [unidade, setUnidade] = useState(isCascade ? value.unidade || "" : "");
  const [selectedId, setSelectedId] = useState("");

  // carrega lista principal
  useEffect(() => {
    api
      .get(`/${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (Array.isArray(res.data) && typeof res.data[0] === "string") {
          setOptions(res.data.map((item, idx) => ({ id: String(idx), nome: item })));
        } else {
          setOptions(res.data);
        }
      })
      .catch((err) => console.error(`Erro ao buscar opções para ${endpoint}:`, err));
  }, [endpoint]);

  // carrega lista de unidades quando grandeza muda
  useEffect(() => {
    if (isCascade && grandeza) {
      api
        .get("/unidade/porgrandeza", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { descricao: grandeza },
        })
        .then((res) =>
          setUnidadeOptions(
            res.data.map((u) => ({
              id: u.id,
              descricao: u.unidade,
              abreviacao: u.abreviacao,
              status: u.status,
            }))
          )
        )
        .catch((err) => console.error(`Erro ao buscar unidades para ${grandeza}:`, err));
    } else {
      setUnidadeOptions([]);
      setUnidade("");
    }
  }, [isCascade, grandeza]);

  if (isCascade) {
    return (
      <div className="space-y-2">
        {/* Grandeza */}
        <SelectInputGeneric
          resource={endpoint}
          displayField="nome"
          valueField="id"
          selected={options.find((o) => o.nome === grandeza)?.id ?? ""}
          onChange={(obj) => {
            const nome = obj?.nome ?? "";
            setGrandeza(nome);
            setUnidade("");
            setSelectedId("");
            onChange({ grandeza: nome, unidade: "" });
          }}
        />

        {/* Unidade dependente */}
        <SelectInputGeneric
          resource="unidade"
          displayField="descricao"
          valueField="id"
          optionsOverride={unidadeOptions}
          selected={unidadeOptions.find((u) => u.descricao === unidade)?.id ?? ""}
          onChange={(obj) => {
            const nome = obj?.descricao ?? "";
            setUnidade(nome);
            onChange({ grandeza, unidade: nome });
          }}
        />
      </div>
    );
  }

  // para status, funcao e demais selects simples
  return (
    <SelectInputGeneric
      resource={endpoint}
      displayField={endpoint === "unidade" ? "descricao" : "nome"}
      valueField="id"
      selected={selectedId}
      onChange={(obj) => {
        // extrai valor final: para objetos, pega .nome (ou .descricao), senão o próprio
        let val;
        if (typeof obj === "object") {
          if (table === "status" || table === "funcao") {
            val = obj.nome;
          } else if (table === "unidade") {
            val = obj.descricao;
          } else {
            val = obj;
          }
          setSelectedId(obj.id ?? "");
        } else {
          val = obj;
          setSelectedId(obj);
        }
        // envia o campo correto
        onChange({ [table]: val });
      }}
    />
  );
}
