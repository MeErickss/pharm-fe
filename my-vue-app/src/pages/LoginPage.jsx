import { useState } from "react"

export function LoginPage(){
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()

        if (login === "" && password === ""){
            window.location.href = "/home"
        } else{
            setError("Email ou senha incorretos")
        }
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