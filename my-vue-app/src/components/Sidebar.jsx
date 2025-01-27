import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function Sidebar() {
    const [login, setLogin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedLogin = localStorage.getItem("login"); // Obtém o login do localStorage
        if (!storedLogin) {
            navigate("/"); // Redireciona para a página de login caso o login não exista
        } else {
            setLogin(storedLogin); // Define o login no estado local
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("login"); // Remove o login do localStorage
        navigate("/");
    };

    return (
        <div className="flex flex-wrap justify-center items-center text-center mt-10">
            <span className="mb-4 font-bold text-lg">{login}</span> {/* Exibe o login */}
            <NavLink
                className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 mt-4 p-3"
                to="/home"
            >
                <strong>HOME</strong>
            </NavLink>
            <NavLink
                className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 mt-4 p-3"
                to="/armazenamento"
            >
                <strong>ARMAZENAMENTO</strong>
            </NavLink>
            <NavLink
                className="w-3/4 h-12 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 mt-4 p-3"
                to="/producao"
            >
                <strong>PRODUÇÃO</strong>
            </NavLink>

            <button
                className="w-3/4 h-12 text-white bg-red-500 rounded-lg hover:bg-red-400 mt-4 p-3"
                onClick={handleLogout}
            >
                <strong>SAIR</strong>
            </button>
        </div>
    );
}
