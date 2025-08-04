// src/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../pages/images/logo.svg"
import {
  SafetyOutlined,
  DesktopOutlined,
  SettingOutlined,
  MenuOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import api from "../api";
import correcoes from "./dicionario";
import grandeza from "./Icons/Grandezas.svg"
import unidade from "./Icons/Unidades.svg"
import distribuicao from "./Icons/Distribuicao.svg"
import farmacia from "./Icons/Farmacia.svg"
import users from "./Icons/Users.svg"
import clp from "./Icons/Clp.svg"
import teste from "./Icons/Teste.svg"
import manutencao from "./Icons/Manutencao.svg"
import parametros from "./Icons/Parametros.svg"


export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [login, setLogin] = useState("");
  const [nivel, setNivel] = useState("");
  const [formulaItems, setFormulaItems] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);  // controla submenus abertos
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("login");
    if (!stored) return navigate("/");
    setLogin(stored);
    const lvl = localStorage.getItem("nivel");
    setNivel(lvl?.toLowerCase() || "");
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/");
  };

    useEffect(() => {
    api
      .get("/formula", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setFormulaItems(response.data))
      .catch((err) => {
        if (err.response?.status === 401) navigator("/");
        console.error("Erro ao buscar fórmulas", err);
        setError("Erro ao carregar fórmulas");
      });
  }, []);

  const items = [
    { label: "Página Inicial", key: "home", icon: <HomeOutlined style={{ fontSize: 20}}/> },
    {
      label: "Produção",
      key: "producao",
      icon: <img src={farmacia} alt="Produção" style={{ width:20 }}/>,
      children: [
        { label: "Monitoramento", key: "producao:monitoramento", icon: <DesktopOutlined style={{ fontSize: 20}} /> },
        { label: "Parâmetros",           key: "producao:parametros",      icon: <img src={parametros} alt="Parâmetros" style={{ width:30, marginLeft:-5 }}/> },
      ],
    },
    {
      label: "Armazenamento",
      key: "armazenagem",
      icon: <img src={distribuicao} alt="Distribuição" style={{ width:25 }}/>,
      children: formulaItems.map((value) =>({
          label: `Formula ${correcoes[value]}`,
          key: `armazenagem:submenu${value}`,
          icon: <MenuOutlined style={{ fontSize: 15}} />,
          children: [
            { label: `Armazem ${correcoes[value]}`, key: `armazenagem:monitoramento:${correcoes[value]}`, icon:<DesktopOutlined style={{ fontSize: 20}} /> },
            { label: "Parâmetros", key: `armazenagem:parametros:${correcoes[value]}`, icon: <img src={parametros} alt="Parâmetros" style={{ width:30, marginLeft:-5 }}/>},
          ],
      }))
    },
    nivel === "admin" && {
      label: "Admin",
      key: "admin",
      icon: <SettingOutlined style={{ fontSize: 20}}/>,
      children: [
        { label: "Produção", key: "admin:producao", icon: <img src={farmacia} alt="Produção" style={{ width:20 }}/> },
        { label: "Armazém",   key: "admin:armazem",  icon: <img src={distribuicao} alt="Distribuição" style={{ width:25}}/> },
        { label: "Unidades",    key: "admin:unidade",  icon: <img src={unidade} alt="Unidade" style={{ width:20 }}/> },
        { label: "Grandezas",   key: "admin:grandezas", icon: <img src={grandeza} alt="Grandeza" style={{ width:20 }}/> },
        { label: "Pontos Controle",   key: "admin:pontocontrole", icon: <img src={clp} alt="Clp" style={{ width:20 }}/> },
        { label: "Usuários",    key: "admin:usuarios",  icon: <img src={users} alt="Users" style={{ width:20 }}/> },
        { label: "Teste",    key: "admin:teste",  icon: <img src={teste} alt="Teste" style={{ width:20 }}/> },
      ],
    },
    nivel === "manutencao" && {
      label: "Cadastros Manutenção",
      key: "manutencao",
      icon: <img src={manutencao} alt="Manutenção" style={{ width:20 }}/>,
    },
    { label: "Sair", key: "logout", icon: <LogoutOutlined style={{ fontSize: 20}} /> },
  ].filter(Boolean);

  const onClick = e => {
    const [group, id, action] = e.key.split(":");
    console.log(group, id, action)
    if (group === "home") return navigate("/home");
    if (group === "producao") return navigate(`/${e.key.replace(/:/g, "/")}`);
    if (group === "armazenagem") return navigate(`/${e.key.replace(/:/g, "/")}`);
    if (group === "admin") return navigate(`/${e.key.replace(/:/g, "/")}`);
    if (group === "manutencao") return navigate(`/${e.key.replace(/:/g, "/")}`);
    if (group === "logout") return handleLogout();
  };

  const onOpenChange = keys => {
    setOpenKeys(keys);
  };

  return (
    <div className="w-full h-full text-center p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500 hover:scrollbar-thumb-indigo-700">
        <img src={logo}/>
        <div className="flex justify-center items-center w-full">
            <h1 className="w-10/12 py-2 border-b-indigo-600 border-b-2 text-neutral-700">{login} <SafetyOutlined /></h1>
        </div>
      <Menu
        mode="inline"
        theme="light"
        style={{ backgroundColor: "white", fontWeight:"bold", color: "black", marginLeft: "-1.5rem", width:"15rem", display:"flex", flexDirection:"column", justifyContent:"center" }}
        inlineCollapsed={collapsed}
        items={items}
        onClick={onClick}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
