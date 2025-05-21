// SelectInputInsert.jsx
import { useState, useEffect } from "react";
import api from "../../api";
import { SelectInputGeneric } from "./SelectInputGeneric";

export function SelectInputInsert({ table, onChange, value = {} }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);

  // Estados controlados, iniciando com value se precisar de edição prévia
  const [grandeza, setGrandeza] = useState(value.grandeza || "");
  const [unidade, setUnidade] = useState(value.unidade || "");

  // 1) Buscar todas as opções do recurso atual (e.g. "status", "funcao", "grandeza")
  useEffect(() => {
    api
      .get(`/${table}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOptions(res.data))
      .catch((err) =>
        console.error(`Erro ao buscar opções para ${table}:`, err)
      );
  }, [table]);

  // 2) Se for "grandeza", ao mudar busca unidades relacionadas
  useEffect(() => {
    if (table === "grandeza" && grandeza) {
      api
        .get("/unidades/por-grandeza", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { descricao: grandeza },
        })
        .then((res) => setUnidadeOptions(res.data))
        .catch((err) =>
          console.error(`Erro ao buscar unidades para ${grandeza}:`, err)
        );
    } else {
      setUnidadeOptions([]);
      setUnidade("");
    }
  }, [grandeza, table]);

  return (
    <div className="space-y-2">
      {/* Select para GRANDEZA (ou outro recurso que não seja cascata) */}
      <SelectInputGeneric
        resource={table}
        displayField={table === "unidade" ? "descricao" : "nome"}
        valueField="id"
        // selected é o id que corresponde ao estado
        selected={
          table === "grandeza"
            ? options.find((o) => o.nome === grandeza)?.id ?? ""
            : options.find((o) =>
                // para recursos que não são grandeza, assumimos objeto simples
                o.id === value.id
              )
            ? String(value.id)
            : ""
        }
        onChange={(obj) => {
          // obj é undefined ou { id, nome } (ou { id, descricao })
          if (table === "grandeza") {
            const nome = obj?.nome ?? "";
            setGrandeza(nome);
            setUnidade("");
            onChange({ grandeza: nome, unidade: "" });
          } else if (table === "unidade") {
            const nome = obj?.descricao ?? "";
            setUnidade(nome);
            onChange({ grandeza, unidade: nome });
          } else {
            // status, funcao, etc.
            onChange(obj);
          }
        }}
      />

      {/* Se for cascata de grandeza → unidade, renderiza o segundo select */}
      {table === "grandeza" && (
        <SelectInputGeneric
          resource="unidade"
          displayField="descricao"
          valueField="id"
          parentValue={grandeza}
          parentResourceKey="descricao"
          optionsOverride={unidadeOptions}
          selected={unidadeOptions.find((u) => u.descricao === unidade)?.id ?? ""}
          onChange={(obj) => {
            const nome = obj?.descricao ?? "";
            setUnidade(nome);
            onChange({ grandeza, unidade: nome });
          }}
        />
      )}
    </div>
  );
}
