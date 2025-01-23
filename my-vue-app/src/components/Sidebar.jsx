import { useState } from "react"
import { NavLink } from "react-router-dom";


export function Sidebar(){
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
//    useEffect(() => {
//        axios
//          .get('http://localhost:5000/api/dados')  // Altere a URL para apontar para o backend
//          .then((response) => {
//            console.log('Dados recebidos:', response.data);
//            setDados(response.data);
//            setLoading(false);
//          })
//          .catch((err) => {
//            console.error('Erro ao buscar dados', err);
//            setError('Não foi possível carregar os dados');
//            setLoading(false);
//          });
//      }, []);
//      
//    if (loading) {
//      return <div>Carregando...</div>;
//    }
//  
//    if (error) {
//      return <div>{error}</div>;
//    }
//
    return(
        
        <div className="flex flex-col">
            <span>USUARIO</span>
            <NavLink className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400"
                to="/home"
            >
                <strong>HOME</strong>
            </NavLink>
            <NavLink className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400"
                to="/armazenamento"
            >
                <strong>ARMAZENAMENTO</strong>
            </NavLink>

            <NavLink className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400"
                to="/producao"
            >
                <strong>PRODUÇÃO</strong>
            </NavLink>

            <NavLink className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400"
                to="/"
            >
                <strong>SAIR</strong>
            </NavLink>
        </div>
    )
}