// src/Sidebar.jsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ArrowUpFromBracket from "./pharmProduction/images/ArrowUpFromBracket.svg";
import CaretDown from "./pharmProduction/images/CaretDown.svg";
import CaretUp from "./pharmProduction/images/CaretUp.svg";
import Clipboard from "./pharmProduction/images/Clipboard.svg";
import Grip from "./pharmProduction/images/Grip.svg";
import House from "./pharmProduction/images/House.svg";
import Industry from "./pharmProduction/images/Industry.svg";
import RightToBracket from "./pharmProduction/images/RightToBracket.svg";
import Admin from "./pharmProduction/images/Admin.svg";
import AdminUsers from "./pharmProduction/images/AdminUsers.svg";
import AdminProduction from "./pharmProduction/images/AdminProduction.svg";
import AdminStorage from "./pharmProduction/images/AdminStorage.svg";
import logo from '../pages/images/logo.svg';
import maintence from "./pharmProduction/images/Maintence.svg";


export function Sidebar() {
  const [login, setLogin] = useState("");
  const [producao, setProducao] = useState(false);
  const [armazenamento, setArmazenamento] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [manutencao, setManutencao] = useState(false);
  const [nivel, setNivel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedLogin = localStorage.getItem("login");
    if (!storedLogin) {
      navigate("/");
    } else {
      setLogin(storedLogin);
      setNivel(localStorage.getItem('nivel').toLowerCase())
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
                <img width={200} src={logo} alt="logo" />
                <span className="font-bold text-base">{login}</span>
            </div>

            {/* Meio - Botões de navegação */}
            <div className="flex flex-col w-full">
                <NavLink 
                    className={({ isActive }) => 
                        `w-full flex items-center gap-2 p-4 text-left hover:bg-gray-300 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                    } 
                    to="/home"
                >
                    <img width={15} src={House}/> Página Inicial
                </NavLink>

                <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left ${
                            producao ? "bg-gray-400 font-bold" : "text-black"
                        }`}
                        onClick={() => setProducao(!producao)}
                    >
                        <img width={15} src={Industry}/>
                        Produção
                        {producao ? <img width={8} src={CaretUp}/> : <img width={8} src={CaretDown}/>}
                    </button>
                    {producao && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/producao"
                            >
                                <img width={10} src={Grip}/> Tela de Monitoramento
                            </NavLink>
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/parametroproducao"
                            >
                                <img width={10} src={Clipboard}/> Parâmetros
                            </NavLink>
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left ${
                            armazenamento ? "bg-gray-400 font-bold" : "text-black"
                        }`}
                        onClick={() => setArmazenamento(!armazenamento)}
                    >
                        <img width={15} src={ArrowUpFromBracket}/>
                        Armazenamento
                        {armazenamento ? <img width={8} src={CaretUp}/> : <img width={8} src={CaretDown}/>}
                    </button>
                    {armazenamento && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/armazenamento"
                            >
                                <img width={10} src={Grip}/> Tela de Monitoramento
                            </NavLink>
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/parametroarmazem"
                            >
                                <img width={10} src={Clipboard}/> Parâmetros
                            </NavLink>
                        </div>
                    )}
                </div>

                
                
                {nivel==="admin" && <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left ${
                            cadastro ? "bg-gray-400 font-bold" : "text-black"
                        }`}
                        onClick={() => setCadastro(!cadastro)}
                    >
                        <img width={15} src={Admin}/>
                        Cadastros Admin
                        {cadastro ? <img width={8} src={CaretUp}/> : <img width={8} src={CaretDown}/>}
                    </button>
                    {cadastro && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/adminparametrosproducao"
                            >
                                <img width={10} src={AdminProduction}/> Parametros Produção
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/adminparametrosarmazem"
                            >
                                <img width={10} src={AdminProduction}/> Parametros Armazém
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/adminparametrosunidade"
                            >
                                <img width={10} src={AdminProduction}/> Cadastro Unidade
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/adminparametrosgrandeza"
                            >
                                <img width={10} src={AdminProduction}/> Cadastro Grandezas
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/adminlogs"
                            >
                                <img width={10} src={AdminProduction}/> Logs Sistema
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/usuarios"
                            >
                                <img width={10} src={AdminUsers}/> Cadastro Usuários
                            </NavLink>
                        </div>
                    )}
                </div>}

                {nivel==="manutencao" && <div className="w-full">
                    <button
                        className={`w-full flex items-center gap-2 p-4 text-left ${
                            manutencao ? "bg-gray-400 font-bold" : "text-black"
                        }`}
                        onClick={() => setManutencao(!manutencao)}
                    >
                        <img width={15} src={maintence}/>
                        Cadastros Manutenção
                        {manutencao ? <img width={8} src={CaretUp}/> : <img width={8} src={CaretDown}/>}
                    </button>
                    {manutencao && (
                        <div className="grid w-full bg-gray-200">
                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/maintencefunctions"
                            >
                                <img width={10} src={AdminStorage}/> Funções Manutenção
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/maintencestatus"
                            >
                                <img width={10} src={AdminStorage}/> Status Manutenção
                            </NavLink>

                            <NavLink 
                                className={({ isActive }) => 
                                    `p-4 mx-2 flex items-center gap-2 ${isActive ? "text-blue-500 font-bold" : "text-black"}`
                                } 
                                to="/usuarios"
                            >
                                <img width={10} src={AdminUsers}/> Usuários
                            </NavLink>
                        </div>
                    )}
                </div>}
                
                <button 
                    className="w-full flex items-center gap-2 p-4 text-left hover:text-red-600 hover:bg-gray-300" 
                    onClick={handleLogout}
                >
                    <img width={15} src={RightToBracket}/>
                    Sair
                </button>
            </div>
        </div>
    );
}
