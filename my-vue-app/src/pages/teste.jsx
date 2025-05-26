import { Alarme } from "../components/pharmProduction/Alarme.jsx";
import imagem from "./images/p.png"
import { Status } from "../components/pharmProduction/Status.jsx";
  import { useState, useEffect } from "react";
  import api from "../api.js"

export function Teste() {
    const [error, setError] = useState("");
    const [dados, setDados] = useState([]);
    const [dadosLen, setDadosLen] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0); // começa em 0
    const [size] = useState(10); // tamanho da página

    
  const fetchData = (pageToLoad) => {
    api.get("/logproducao", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        page: pageToLoad,
        size: size
      }
    })
    .then(response => {
      setDados(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        navigator('/login'); 
      }
      console.error("Erro ao buscar dados", err);
      setError("Não foi possível carregar os dados");
    });
  };

  useEffect(() => {
    fetchData(0); // carrega página 0 inicialmente
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchData(newPage);
    }
  };

  return (
    <main className="w-full h-full bg-gray-100">

      <div className="col-span-2 row-span-2 bg-red-500">
        <div className="w-full flex flex-col items-center">
          {dados.map((item, index) => (
            <div key={index} className="w-full bg-gray-200 my-1 p-2 rounded">
              <p className="text-sm font-medium">{item.descricao}</p>
              <p className="text-xs text-gray-600">{item.dataHora}</p>
              <p className="text-xs text-gray-800">Status: {item.status}</p>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm mt-1">Página {page + 1} de {totalPages}</span>
            <button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={page + 1 >= totalPages}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
