import { useState, useEffect } from "react"
import axios from 'axios';

export function LoginPage(){
    const [dados, setDados] = useState([])
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        axios
          .get('http://localhost:5000/api/dados')  // Altere a URL para apontar para o backend
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
        e.preventDefault()

        const map = dados.map((x) => {
            if (login == x.login && password == x.password){
                window.location.href = "/home"
            }
            setError("Email ou senha incorretos") 
            })
        map()
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="login"></label>
                <input type="text" name="login" placeholder="Login..." value={login} onChange={(e) => setLogin(e.target.value)} />
                <label htmlFor="password"></label>
                <input type="password" name="password" placeholder="Senha..." value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <p>{error}</p>}
                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}