import { Layout } from "./Layout.jsx";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Home(){
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
        axios
          .get('http://localhost:5000/api/dados')  // Altere a URL para apontar para o backend
          .then((response) => {
            console.log('Dados recebidos:', response.data);
            setDados(response.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Erro ao buscar dados', err);
            setError('Não foi possível carregar os dados');
            setLoading(false);
          });
      }, []);
      
      
  
    if (loading) {
      return <div>Carregando...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
        <div>
          <h1>Dados da Tabela</h1>
          <ul>
            {Array.isArray(dados) ? (
              dados.map((item) => <li key={item.id}>{item.nome}</li>)
            ) : (
              <p>Dados não disponíveis</p>
            )}
          </ul>
        </div>
      );
      
  };
  