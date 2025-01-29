import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./pharmProduction/images/logo.svg"

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
        <div className="flex flex-wrap items-center text-center h-screen bg-cyan-600">
            <div className="flex flex-wrap justify-center items-center h-1/6 gap-4">
                <img className="w-10/12" src={logo} alt="logo"/>
                <span className="font-bold text-lg">{login}</span> {/* Exibe o login */}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-14">
                <NavLink
                    className="w-3/4 h-12 text-white bg-cyan-900 shadow-2xl rounded-lg hover:brightness-125 mt-4 p-3"
                    to="/home"
                >
                    <strong>HOME</strong>
                </NavLink>
                <NavLink
                    className="w-3/4 h-12 text-white bg-cyan-900 shadow-2xl rounded-lg hover:brightness-125 mt-4 p-3"
                    to="/armazenamento"
                >
                    <strong>ARMAZENAMENTO</strong>
                </NavLink>
                <NavLink
                    className="w-3/4 h-12 text-white bg-cyan-900 shadow-2xl rounded-lg hover:brightness-125 mt-4 p-3"
                    to="/producao"
                >
                    <strong>PRODUÇÃO</strong>
                </NavLink>
                <button
                    className="w-3/4 h-12 text-white bg-red-500 rounded-lg hover:brightness-125 mt-4 p-3"
                    onClick={handleLogout}
                >
                    <strong>SAIR</strong>
                </button>
            </div>
        </div>
    );
}
