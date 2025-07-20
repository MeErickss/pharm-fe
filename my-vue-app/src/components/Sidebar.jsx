// src/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../pages/images/logo.svg"
import {
  SafetyOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  SettingOutlined,
  HistoryOutlined,
  BarsOutlined,
  FormOutlined,
  CodeOutlined,
  LogoutOutlined

} from "@ant-design/icons";
import { Menu } from "antd";
import api from "../api";
import correcoes from "./dicionario";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [login, setLogin] = useState("");
  const [nivel, setNivel] = useState("");
  const [formulaItems, setFormulaItems] = useState([]);
  const [storageItems, setStorageItems] = useState([]);
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
    { label: "Página Inicial", key: "home", icon: <PieChartOutlined /> },
    {
      label: "Produção",
      key: "producao",
      icon: <ContainerOutlined />,
      children: [
        { label: "Monitoramento", key: "producao:monitoramento", icon: <DesktopOutlined /> },
        { label: "Parâmetros",           key: "producao:parametros",      icon: <FormOutlined /> },
      ],
    },
    {
      label: "Armazenamento",
      key: "armazenagem",
      icon: <ContainerOutlined />,
      children: formulaItems.map((value) =>({
          label: `Formula ${correcoes[value]}`,
          key: `armazenagem:submenu${value}`,
          icon: <BarsOutlined />,
          children: [
            { label: `Armazem ${correcoes[value]}`, key: `armazenagem:monitoramento:${correcoes[value]}`, icon:<DesktopOutlined /> },
            { label: "Parâmetros", key: `armazenagem:parametros:${correcoes[value]}`, icon: <FormOutlined />},
          ],
      }))
    },
    nivel === "admin" && {
      label: "Cadastros Admin",
      key: "admin",
      icon: <SettingOutlined />,
      children: [
        { label: "Parâmetros Produção", key: "admin:producao", icon: <FormOutlined /> },
        { label: "Parâmetros Armazém",   key: "admin:armazem",  icon: <FormOutlined /> },
        { label: "Unidades",    key: "admin:unidade",  icon: <FormOutlined /> },
        { label: "Grandezas",   key: "admin:grandezas", icon: <FormOutlined /> },
        { label: "Pontos Controle",   key: "admin:pontocontrole", icon: <FormOutlined /> },
        { label: "Usuários",    key: "admin:usuarios",  icon: <FormOutlined /> },
        { label: "Logs Sistema",         key: "admin:logs",      icon: <HistoryOutlined /> },
        { label: "Teste",         key: "admin:teste",      icon: <CodeOutlined /> },
      ],
    },
    nivel === "manutencao" && {
      label: "Cadastros Manutenção",
      key: "manutencao",
      icon: <ContainerOutlined />,
    },
    { label: "Sair", key: "logout", icon: <LogoutOutlined /> },
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
    <div className="w-full h-full text-center p-2 overflow-hidden">
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
