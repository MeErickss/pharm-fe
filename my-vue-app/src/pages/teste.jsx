import { GridAdmin } from "../components/Admin/GridAdmin"
import { useState, useEffect } from "react";
import api from "../api";

export function Teste() {
  const [farmacia, setFarmacia] = useState([])
  const [farmaciaLen, setFarmaciaLen] = useState(0);
  const [distribuicao, setDistribuicao] = useState([])
  const [distribuicaLen, setDistribuicaoLen] = useState(0);
  const [dell, setDell] = useState(0);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState({ edit: null, delete: null });



  useEffect(() => {
    api.get("/farmacia", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
  })
  .then(response => {      
      setFarmacia(response.data);
      console.log(response.data)
    })
  .catch(err => {        if (err.response?.status === 401) {
          navigator('/login'); 
        }
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

    useEffect(() => {
      if (farmacia.length > 0) {
        setFarmaciaLen(Object.keys(farmacia[0]).length);
      }
    }, [farmacia]);

    /////////////////////////////////////


  useEffect(() => {
    api.get("/distribuicao", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
  })
  .then(response => {      
      setDistribuicao(response.data);})
  .catch(err => {        if (err.response?.status === 401) {
          navigator('/login'); 
        }
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

    useEffect(() => {
      if (farmacia.length > 0) {
        setDistribuicaoLen(Object.keys(farmacia[0]).length);
      }
    }, [distribuicao]);

    useEffect(() => {
      if (!dell) return;
    
      const fetchData = async () => {
        try {
          var option = ""
          var question=confirm(`Deseja excluir o Registro ${dell}`);
          if (question==true)
            {
            option="Opção de exclusão selecionada";
            const response = await api.delete(`/farmacia/${dell}`)
      
            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.statusText}`);
            }
      
            console.log("Registro deletado com sucesso");
              setFarmacia((prevDados) => prevDados.filter((item) => item.id !== dell));
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
    <div className="w-screen h-screen flex flex-wrap">
      {/* <GridAdmin
        dados={farmacia}
        dadosLen={farmaciaLen}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        onEdit={toggleEditar}
        onDelete={handleDelete}
      /> */}

      <GridAdmin
        dados={distribuicao}
        dadosLen={distribuicaLen}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        onEdit={toggleEditar}
        onDelete={handleDelete}
      />
    </div>
  )
}
