// src/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';           // instância axios comCredentials
import logo from './images/logo.svg';

export function PaginaLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // faz login e o cookie HttpOnly é gravado automaticamente
      const usuario = await api.post('/usuario/login', {
        login: login,
        senha: password
      });

      localStorage.setItem('token', usuario.data.cookie)
      localStorage.setItem('login', login);
      localStorage.setItem('nivel', usuario.data.nivel);
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError('Login ou senha inválidos');
      } else {
        setError('Erro ao tentar logar. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center w-screen h-screen bg-slate-500">
      <img width={200} src={logo} alt="logo" />
      <div className="flex w-1/4 h-10/12 p-8 bg-slate-700 rounded-lg shadow-2xl">
        <form onSubmit={handleLogin} className="w-full">
          <h2 className="text-center text-indigo-600 font-bold mb-6">LOGIN</h2>

          <label htmlFor="login" className="font-semibold">Email:</label>
          <input
            id="login"
            type="email"
            placeholder="seu@email.com"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full h-10 my-2 rounded px-2 bg-slate-200 border-2 border-slate-300 focus:outline-none"
            required
          />

          <label htmlFor="password" className="font-semibold">Senha:</label>
          <input
            id="password"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 my-2 rounded px-2 bg-slate-200 border-2 border-slate-300 focus:outline-none"
            required
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="text-center mt-6">
            <button
              type="submit"
              className="w-1/2 h-10 bg-indigo-600 hover:brightness-90 text-white rounded"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
