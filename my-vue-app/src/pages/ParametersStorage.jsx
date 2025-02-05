import { useState, useEffect } from "react";
import axios from 'axios';


export function ParametersStorage({ onClose }) {
  const [error, setError] = useState("");

  useEffect(() => {
      axios
          .get('http://localhost:5000/api/dados')
          .then((response) => {
              console.log('Dados recebidos:', response.data);
              setDados(response.data);
          })
          .catch((err) => {
              console.error('Erro ao buscar dados', err);
              setError('Não foi possível carregar os dados');
          });
  }, []);

  const handleData = (e) => {
    e.preventDefault();


  }
    return (
      <div className="w-full h-full p-4 bg-gray-100">
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-6">
        <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Parametro</div>
          <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Tipo</div>
          <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Unidade</div>
          <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Valor</div>
          <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Valor Minimo</div>
          <div className="grid bg-gray-200 border-b-2 border-gray-300 p-2">Valor Maximo</div>
          <div className="px-4">A</div>
          <div className="px-4">B</div>
          <div className="px-4">SEG</div>
          <div className="px-4">0</div>
          <div className="px-4">1</div>
          <div className="px-4">2</div>
        </div>
      </div>
    );
  }
  