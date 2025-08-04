import { useState, useEffect } from "react";
import api from "../../api";
import { Cabecalho } from "../../components/Cabecalho";
import { GridAdmin } from "../../components/Admin/GridAdmin";
import { EditarDado } from "../../components/Admin/EditarDado";
import { AdicionarDado } from "../../components/Admin/AdicionarDado";


  export function AdminPontoControle() {
    const [error, setError] = useState("");
    const [dados, setDados] = useState([]);
    const [dadosLen, setDadosLen] = useState(0);
    const [dell, setDell] = useState(0);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState({ edit: null, delete: null });
    const tabela = "PRODUCAO"
    const [size] = useState(6)



  useEffect(() => {
    api.get("/pontocontrole", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }})
  .then(response => {      
    console.log(response.data)
      setDados(response.data);})
  .catch(err => {        if (err.response?.status === 401) {
          navigator('/login'); 
        }
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
      if (!dell) return;
    
      const fetchData = async () => {
        try {
          var option = ""
          var question=confirm(`Deseja excluir o Registro ${dell}`);
          if (question==true)
            {
            option="Opção de exclusão selecionada";
            const response = await api.delete(`/parametro/${dell}`)
      
            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.statusText}`);
            }
      
            console.log("Registro deletado com sucesso");
              setDados((prevDados) => prevDados.filter((item) => item.id !== dell));
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
      window.location.reload()
    };
    

    const toggleEditar = (id) => {
      setEditId(id);
      setShowModalEdit(true);
      console.log(editId)
    };
    
    return (
      <div className="w-full rounded h-full bg-gray-100 p-4 overflow-y-visible overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500 hover:scrollbar-thumb-indigo-700">

        <Cabecalho dados={dados} nivel={1} setshowModalAdd={setShowModalAdd} setDados={setDados} tabela={"Ponto de Controle"}/>

        {showModalAdd && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
              <AdicionarDado dados={dados} param={true} table={"pontocontrole"} closeModal={() => setShowModalAdd(false)} /> {/* Componente JSX dentro do modal */}
            </div>
          </div>
        )}

        {showModalEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
              <EditarDado id={editId} param={true} table={"pontocontrole"} dados={dados} closeModal={() => setShowModalEdit(false)} />
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
