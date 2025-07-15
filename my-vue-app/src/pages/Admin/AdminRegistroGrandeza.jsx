import { useState, useEffect } from "react";
import api from "../../api";
import { EditarGrandeza } from "../../components/Admin/EditarGrandeza";
import { AdicionarGrandeza } from "../../components/Admin/AdicionarGrandeza";
import { Tooltip } from "antd";
import CollapseC from "../../components/Collapse";
import { Cabecalho } from "../../components/Cabecalho";

export function AdminRegistroGrandeza() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [dadosLen, setDadosLen] = useState(0);
  const [dell, setDell] = useState({
    id:null,
    tabela:""
  });

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  // Agora o estado tem deleteParam e deleteUni separados:
  const [tooltipVisible, setTooltipVisible] = useState({
    edit: null,
    deleteParam: null,
    deleteUni: null,
    delete:null
  });

  const [editId, setEditId] = useState(null);
  const tabela = "grandeza";

  useEffect(() => {
    api
      .get(`/grandeza`, { token: localStorage.getItem("cookie") })
      .then((response) => {
        console.log("Dados recebidos aa:", response.data);
        setDados(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

  useEffect(() => {
    if (dados.length > 0) {
      setDadosLen(Object.keys(dados[0]).length);
    }
  }, [dados]);

  useEffect(() => {
    if (dell.id == null) return;

    const fetchData = async () => {
      try {
        let question = confirm(`Deseja excluir o Registro ${dell.id}?`);
        if (question) {
          const response = await api.delete(`/${dell.tabela}/${dell.id}`);
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }
          console.log("Registro deletado com sucesso");
          setDados((prevDados) =>
          prevDados.filter((item) => item.id !== dell.id));
          } else {
          // Usuário cancelou a exclusão
          }
      } catch (error) {
        console.error("Erro ao deletar dados:", error);
      }
    };

    fetchData();
  }, [dell]);

  const handleDelete = (id) => {
    setDell({id:id, tabela:"grandeza"});
    window.location.reload();
  };

  const handleDeleteParam = (id) => {
    setDell({id:id, tabela:"parametro"});
    window.location.reload();
  };

  const handleDeleteUni = (id) => {
    setDell({id:id, tabela:"unidade"});
    window.location.reload();
  };

  const toggleEditar = (id) => {
    setEditId(id);
    setShowModalEdit(true);
  };

  // ←–––––––––– Handlers separados ––––––––––→
  function handleMouseEnterParam(id) {
    setTooltipVisible((prev) => ({ ...prev, deleteParam: id }));
  }
  function handleMouseLeaveParam() {
    setTooltipVisible((prev) => ({ ...prev, deleteParam: null }));
  }

  function handleMouseEnterUni(id) {
    setTooltipVisible((prev) => ({ ...prev, deleteUni: id }));
  }
  function handleMouseLeaveUni() {
    setTooltipVisible((prev) => ({ ...prev, deleteUni: null }));
  }
  function handleMouseEnterEdit(id) {
    setTooltipVisible((prev) => ({ ...prev, edit: id }));
  }
  function handleMouseLeaveEdit() {
    setTooltipVisible((prev) => ({ ...prev, edit: null }));
  }

  function handleMouseEnterDelete(id) {
    setTooltipVisible((prev) => ({ ...prev, delete: id }));
  }
  
  function handleMouseLeaveDelete() {
    setTooltipVisible((prev) => ({ ...prev, delete: null }));
  }
  // ←––––––––––––––––––––––––––––––––––––––––→

  const collapseItems = dados.map((item) => ({
    key: item.id.toString(),
    label: (
      <div className="grid grid-cols-5 gap-4 w-full">
        <div>{item.id}</div>
        <div>{item.descricao}</div>
        <div>{item.status}</div>
        <div>{item.parametros.length} parâmetro(s)</div>
        <div>{item.unidades.length} unidade(s)</div>
      </div>
    ),
    children: (
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Parâmetros:</h4>
          {item.parametros.map((param) => (
            <div key={param.id} className="mb-2 pl-4">
              <div className="flex flex-row gap-4">
                {param.descricao}
                <Tooltip
                  title={`Excluir registro: ${param.id}`}
                  open={tooltipVisible.deleteParam === param.id}
                >
                  <button
                    onMouseEnter={() => handleMouseEnterParam(param.id)}
                    onMouseLeave={handleMouseLeaveParam}
                    onClick={() => handleDeleteParam(param.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="16"
                      className="fill-gray-600 border-2 hover:fill-red-500"
                    >
                      <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Unidades:</h4>
          {item.unidades.map((unidade) => (
            <div key={unidade.id} className="mb-2 pl-4">
              <div className="flex items-center gap-2">
                {unidade.abreviacao} - {unidade.unidade}
                <Tooltip
                  title={`Excluir registro: ${unidade.id}`}
                  open={tooltipVisible.deleteUni === unidade.id}
                >
                  <button
                    onMouseEnter={() => handleMouseEnterUni(unidade.id)}
                    onMouseLeave={handleMouseLeaveUni}
                    onClick={() => handleDeleteUni(unidade.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="16"
                      className="fill-gray-600 border-2 hover:fill-red-500"
                    >
                      <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <Tooltip
            title={`Editar registro: ${item.id}`}
            open={tooltipVisible.edit === item.id}
          >
            <button
              onMouseEnter={() => handleMouseEnterEdit(item.id)}
              onMouseLeave={handleMouseLeaveEdit}
              onClick={() => toggleEditar(item.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="16"
                className="fill-blue-600 hover:fill-orange-500"
              >
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
              </svg>
            </button>
          </Tooltip>

          <Tooltip
            title={`Excluir registro: ${item.id}`}
            open={tooltipVisible.delete === item.id} 
            // Se quiser tooltip principal de “excluir grandeza”, crie também campo deletePrincipal no estado
          >
            <button onClick={() => handleDelete(item.id)} onMouseEnter={() => handleMouseEnterDelete(item.id)} onMouseLeave={handleMouseLeaveDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="16"
                className="fill-red-500"
              >
                <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full rounded h-full bg-gray-100 p-4 overflow-y-visible">
      <Cabecalho
        dados={dados}
        nivel={1}
        setshowModalAdd={setShowModalAdd}
        setDados={setDados}
        tabela={"Grandezas"}
      />

      {showModalAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <AdicionarGrandeza
              dados={dados}
              param={false}
              table={"grandeza"}
              closeModal={() => setShowModalAdd(false)}
            />
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <EditarGrandeza
              id={editId}
              param={false}
              table={"grandeza"}
              dados={dados}
              closeModal={() => setShowModalEdit(false)}
            />
          </div>
        </div>
      )}

      <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
        <div className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b grid-cols-5">
          <div>Id</div>
          <div>Descrição</div>
          <div>Status</div>
          <div>Parâmetros</div>
          <div>Unidades</div>
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
