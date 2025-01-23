import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [dados, setDados] = useState([]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="login">Login:</label>
                <input
                    type="text"
                    name="login"
                    placeholder="Login..."
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Senha..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
