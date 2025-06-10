import { useState, useEffect } from "react";
import api from "../../api"
import { GridAdmin } from "../../components/Admin/GridAdmin";
import { AdicionarDado } from "../../components/Admin/AdicionarDado"; 
import { EditarDado } from "../../components/Admin/EditarDado";
import { Cabecalho } from "../../components/Cabecalho";



export function AdminRegistroFuncao() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [dadosLen, setDadosLen] = useState(0);
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("");
  const [dell, setDell] = useState(0);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState({ edit: null, delete: null });
  const tabela = "funcoes"

  useEffect(() => {
    api.get("/funcao",{token:localStorage.getItem('cookie')})
      .then((response) => {
        setDados(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // Redirecionar para login se não autenticado
          navigator('/login'); 
        }
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, [navigator]); // Adicione nav como dependência

  useEffect(() => {
    if (dados.length > 0) {
      setDadosLen(Object.keys(dados[0]).length);
    }
  }, [dados]);

  useEffect(() => {
    if (!dell) return;
  
    const fetchData = async () => {
      try {
        var option = ""
        var question=confirm(`Deseja excluir o Registro ${dell}`);
        if (question==true)
          {
          option="Opção de exclusão selecionada";
          const response = await api.delete(`/funcao/${dell}`)
    
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }
    
          console.log("Registro deletado com sucesso");
            setDados((prevDados) => prevDados.filter((item) => item.ID !== dell));
          }
        else
          {
          option="You pressed Cancel!";
          }
      } catch (error) {
        console.error("Erro ao deletar dados:", error);
      }
    };
  
    fetchData();
  }, [dell]);
  
  
  const handleDelete = (id) => {
    setDell(id);
  };
  
  const handleQuery = (event) => {
    setQuery(event);
  
    const filteredData = dados.filter((item) => {
      const value = item[filter];
        return value.toString().toLowerCase().includes(event.toLowerCase());
    });
  
    setDados(filteredData);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const toggleEditar = (id) => {
    setEditId(id);
    setShowModalEdit(true);
  };

  const handleReset = () => {
    setQuery("");
    setFilter("");
    axios
      .get(`http://localhost:5000/api/table?table=${tabela}`)
      .then((response) => {
        console.log("Dados restaurados:", response.data);
        setDados(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  };
  
  return (
    <div className="w-full h-full bg-gray-100 p-4">
        <Cabecalho dados={dados} nivel={1} setshowModalAdd={setShowModalAdd}/>

      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <AdicionarDado dados={dados} param={false} table={"funcoes"} closeModal={() => setShowModalAdd(false)} /> {/* Componente JSX dentro do modal */}
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <EditarDado id={editId} param={false} table={"funcoes"} dados={dados} closeModal={() => setShowModalEdit(false)} />
          </div>
        </div>
      )}

      <GridAdmin
        dados={dados}
        dadosLen={dadosLen}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        onEdit={toggleEditar}
        onDelete={handleDelete}
      />
    </div>
  );
}
