import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "./images/logo.svg"

export function LoginPage() {
    const [dados, setDados] = useState([]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/users')
            .then((response) => {
                console.log('Dados recebidos:', response.data);
                setDados(response.data);
            })
            .catch((err) => {
                console.error('Erro ao buscar dados', err);
                setError('Não foi possível carregar os dados');
            });
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        const user = dados.find((x) => login === x.login && password === x.password);

        if (user) {
            localStorage.setItem('login', login);
            navigate("/home");
            setError("");
        } else {
            setError("Email ou senha incorretos");
        }
    };

    return (
        <div className="flex flex-wrap flex-col gap-10 justify-center items-center w-screen h-screen bg-slate-500">
            <img width={200} src={logo} alt="logo" />
            <div className="flex flex-wrap w-1/4 h-10/12 p-8 text-left bg-slate-700 rounded-lg shadow-2xl">
                <form  onSubmit={handleLogin}>
                    <div className="text-center text-indigo-600"><h2><strong>CADASTRO</strong></h2></div>
                    <label className="w-full" htmlFor="login"><strong>Login:</strong></label>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login..."
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full h-8 my-4 rounded-sm bg-slate-200 px-2 focus:outline-none border-2 border-slate-300"
                    />
                    <label className="w-full" htmlFor="password"><strong>Senha:</strong></label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-8 my-4 rounded-sm bg-slate-200 px-2 focus:outline-none border-2 border-slate-300"
                    />
                    {error && <p className="text-red-600"><strong>{error}</strong></p>}
                    <div className="text-center my-4"><button className="w-1/2 h-8 bg-indigo-600 hover:brightness-125 rounded-md " type="submit">Entrar</button></div>
                </form>
            </div>
        </div>
    );
}
