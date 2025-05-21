import { useState, useEffect } from "react";
import api from "../../api";
import { Tooltip } from "antd";
import { RegistrarDados } from "../../components/Admin/RegistrarDados";
import { AtualizarDados } from "../../components/Admin/AtualizarDados";
import CollapseC from "../../components/Collapse";
import { Cabecalho } from "../../components/Cabecalho";

export function AdminRegistroUnidade() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [dell, setDell] = useState(0);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const tabela = "unidade";

  // Carrega dados iniciais
  useEffect(() => {
    api
      .get(`/unidade`, { token: localStorage.getItem("cookie") })
      .then((response) => {
        setDados(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

  // Excluir registro
  useEffect(() => {
    if (!dell) return;

    const fetchData = async () => {
      try {
        const confirmado = window.confirm(`Deseja excluir o Registro ${dell}?`);
        if (!confirmado) return;

        const response = await api.delete(`/unidade/${dell}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        setDados((prev) => prev.filter((item) => item.id !== dell));
      } catch (err) {
        console.error("Erro ao deletar dados:", err);
      }
    };

    fetchData();
  }, [dell]);

  const handleDelete = (id) => setDell(id);

  // Filtro de busca
  const handleQuery = (value) => {
    setQuery(value);
    if (!filter) {
      alert("Defina um filtro");
      return;
    }
    const filtered = dados.filter((item) => {
      const campo = item[filter];
      return campo?.toString().toLowerCase().includes(value.toLowerCase());
    });
    setDados(filtered);
  };

  const toggleEditar = (id) => {
    setEditId(id);
    setShowModalEdit(true);
  };


  const collapseItems = dados.map((item) => ({
    key: String(item.id),
    label: (
      <div className="grid grid-cols-5 gap-4 w-full">
        <div>{item.id}</div>
        <div>{item.abreviacao}</div>
        <div>{item.status}</div>
        <div>{item.unidade}</div>
        <div>
          {(item.parametro?.length ?? 0) > 0
            ? `${item.parametro.length} parâmetro(s)`
            : "Sem parâmetros"}
        </div>
      </div>
    ),
    children: (
      <div className="p-4">
        <h4 className="font-semibold mb-2">Parâmetros:</h4>
        {(item.parametro ?? []).map((param) => (
          <div key={param.id} className="mb-2 pl-4">
            {param.descricao}
          </div>
        ))}
        {!item.parametro?.length && (
          <div className="pl-4 text-sm text-gray-500">
            Nenhum parâmetro cadastrado
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Tooltip title={`Editar registro: ${item.id}`}>
            <button onClick={() => toggleEditar(item.id)}>
              {/* ícone de editar */}
            </button>
          </Tooltip>
          <Tooltip title={`Excluir registro: ${item.id}`}>
            <button onClick={() => handleDelete(item.id)}>
              {/* ícone de excluir */}
            </button>
          </Tooltip>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <Cabecalho
        dados={dados}
        nivel={1}
        setshowModalAdd={setShowModalAdd}
        setDados={setDados}
        tabela={tabela}
      />

      {/* Modal de Adicionar */}
      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] bg-white p-6 rounded-lg shadow-lg">
            <RegistrarDados
              dados={dados}
              param={false}
              table={tabela}
              closeModal={() => setShowModalAdd(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] bg-white p-6 rounded-lg shadow-lg">
            <AtualizarDados
              id={editId}
              param={false}
              table={tabela}
              dados={dados}
              closeModal={() => setShowModalEdit(false)}
            />
          </div>
        </div>
      )}

      {/* Collapse de registros */}
      <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
        <div className="grid bg-gray-200 font-semibold text-gray-700 p-3 border-b grid-cols-5">
          <div>ID</div>
          <div>ABREVIACAO</div>
          <div>STATUS</div>
          <div>UNIDADE</div>
          <div>PARAMETROS</div>
        </div>
        <CollapseC
          items={collapseItems}
          bordered={false}
          className="custom-collapse"
          expandIconPosition="end"
        />
      </div>
    </div>
  );
}
