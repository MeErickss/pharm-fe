// src/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../pages/images/logo.svg"
import {
  SafetyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, Button } from "antd";
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
      icon: <AppstoreOutlined />,
      children: [
        { label: "Monitoramento", key: "producao:monitoramento", icon: <PieChartOutlined /> },
        { label: "Parâmetros",           key: "producao:parametros",      icon: <DesktopOutlined /> },
      ],
    },
    {
      label: "Armazenamento",
      key: "armazenagem",
      icon: <ContainerOutlined />,
      children: formulaItems.map((value) =>({
          label: `Formula ${correcoes[value]}`,
          key: `armazenagem:submenu${value}`,
          icon: <MenuUnfoldOutlined />,
          children: [
            { label: `Armazem ${correcoes[value]}`, key: `armazenagem:monitoramento:${correcoes[value]}` },
            { label: "Parâmetros", key: `armazenagem:parametros:${correcoes[value]}`},
          ],
      }))
    },
    nivel === "admin" && {
      label: "Cadastros Admin",
      key: "admin",
      icon: <SettingOutlined />,
      children: [
        { label: "Parâmetros Produção", key: "admin:producao", icon: <AppstoreOutlined /> },
        { label: "Parâmetros Armazém",   key: "admin:armazem",  icon: <AppstoreOutlined /> },
        { label: "Cadastro Unidade",    key: "admin:unidade",  icon: <AppstoreOutlined /> },
        { label: "Cadastro Grandezas",   key: "admin:grandezas", icon: <AppstoreOutlined /> },
        { label: "Cadastro Usuários",    key: "admin:usuarios",  icon: <SettingOutlined /> },
        { label: "Logs Sistema",         key: "admin:logs",      icon: <AppstoreOutlined /> },
        { label: "Teste",         key: "admin:teste",      icon: <AppstoreOutlined /> },
      ],
    },
    nivel === "manutencao" && {
      label: "Cadastros Manutenção",
      key: "manutencao",
      icon: <ContainerOutlined />,
    },
    { label: "Sair", key: "logout", icon: <MenuFoldOutlined /> },
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
    <div className="w-full h-full text-center p-2">
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
