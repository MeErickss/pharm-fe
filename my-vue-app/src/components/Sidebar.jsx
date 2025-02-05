import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faIndustry, 
    faTrash, 
    faPen, 
    faCaretDown, 
    faCaretUp, 
    faHouse,
    faArrowUpFromBracket,
    faGrip,
    faRightToBracket,
    faClipboard
} from "@fortawesome/free-solid-svg-icons";

import logo from "./pharmProduction/images/logo.svg";

export function Sidebar() {
    const [login, setLogin] = useState("");
    const [producao, setProducao] = useState(false);
    const [armazenamento, setArmazenamento] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedLogin = localStorage.getItem("login");
        if (!storedLogin) {
            navigate("/");
        } else {
            setLogin(storedLogin);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("login");
        navigate("/");
    };

    return (
        <div className="grid grid-rows-[auto_1fr_auto] h-screen bg-slate-100 text-sm w-52">
            {/* Topo - Logo e usuário */}
            <div className="flex flex-col py-6 items-center">
                <img className="w-10/12 mb-2" src={logo} alt="logo" />
                <span className="font-bold text-lg">{login}</span>
            </div>

            {/* Meio - Botões de navegação */}
            <div className="flex flex-col w-full">
                <NavLink 
                    className={({ isActive }) => 
                        `w-full flex items-center gap-2 p-4 text-left hover:bg-gray-300 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                    } 
                    to="/home"
                >
                    <FontAwesomeIcon icon={faHouse} /> Página Inicial
                </NavLink>

                <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left hover:bg-gray-200 ${
                            producao ? "text-blue-500 font-bold" : "text-black"
                        }`}
                        onClick={() => setProducao(!producao)}
                    >
                        <FontAwesomeIcon icon={faIndustry} />
                        Produção
                        <FontAwesomeIcon icon={producao ? faCaretUp : faCaretDown} className="ml-auto" />
                    </button>
                    {producao && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/producao"
                            >
                                <FontAwesomeIcon icon={faGrip} /> Tela de Monitoramento
                            </NavLink>
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/parametroproducao"
                            >
                                <FontAwesomeIcon icon={faClipboard} /> Parâmetros
                            </NavLink>
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left hover:bg-gray-200 ${
                            armazenamento ? "text-blue-500 font-bold" : "text-black"
                        }`}
                        onClick={() => setArmazenamento(!armazenamento)}
                    >
                        <FontAwesomeIcon icon={faArrowUpFromBracket} />
                        Armazenamento
                        <FontAwesomeIcon icon={armazenamento ? faCaretUp : faCaretDown} className="ml-auto" />
                    </button>
                    {armazenamento && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/armazenamento"
                            >
                                <FontAwesomeIcon icon={faGrip} /> Tela de Monitoramento
                            </NavLink>
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/parametroarmazem"
                            >
                                <FontAwesomeIcon icon={faClipboard} /> Parâmetros
                            </NavLink>
                        </div>
                    )}
                </div>
                
                <button 
                    className="w-full flex items-center gap-2 p-4 text-left hover:text-red-600 hover:bg-gray-300" 
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    Sair
                </button>
            </div>
        </div>
    );
}
