import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // instância axios configurada (baseURL, interceptors, etc.)

import distribuicaoImg from "./Tudo/distribuicao.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
// Importe outras imagens conforme necessidade:
import bomba2Img from "./Tudo/bomba2.png";

const ORIGINAL_WIDTH = 520;
const ORIGINAL_HEIGHT = 400;

// Ciclo de status local
const STATUSES = [
  "DESLIGADO",
  "ATIVO",
  "MANUTENCAO",
  "ESTRAGADO",
];

// Filtros CSS mapeados
const filters = {
  DESLIGADO:  "none",
  ATIVO:      "grayscale(1) sepia(0.7) saturate(8) hue-rotate(90deg) brightness(0.9)",
  MANUTENCAO: "grayscale(1) sepia(1) saturate(5) hue-rotate(0deg) brightness(1.2) contrast(1)",
  ESTRAGADO:  "grayscale(1) brightness(0.2)",
};

// Mapeamento de prefixos de nomePadronizado para imagem
const prefixImageMap = {
  "valvula1": valvula1Img,
  "valvula2": valvula2Img,
  "sensor1":  sensor1Img,
  // Se houver sensor2, adicione aqui; ou reutilize sensor1Img
  "sensor2":  sensor1Img,
  "bomba":    bomba2Img,
  "bomba2":   bomba2Img,
  // Adicione outros prefixos conforme entidades em DistribuicaoPlanta
};

export function Distribuicao() {
  const navigate = useNavigate();
  // Dados brutos vindos da API: array de objetos DistribuicaoPlantaDto retornados via GET /distribuicao
  const [distribuicaoData, setDistribuicaoData] = useState([]);
  // Elementos processados para render: { id, key, label, coordsPx, img, statusEnum, endereco, tipo, posicaoNoLayout }
  const [elementosData, setElementosData] = useState([]);
  // Status local por key (lowercase): "DESLIGADO", "ATIVO", etc.
  const [statusMap, setStatusMap] = useState({});
  // Conjunto de ids em atualização (para desabilitar clique/modal loading)
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [error, setError] = useState("");

  // 1) Fetch inicial dos dados de DistribuicaoPlanta
  useEffect(() => {
    api.get("/distribuicao", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      const data = response.data;
      if (Array.isArray(data)) {
        setDistribuicaoData(data);
      } else {
        console.warn("Resposta /distribuicao não é array:", data);
        setDistribuicaoData([]);
      }
    })
    .catch(err => {
      if (err.response?.status === 401) {
        navigate('/login');
      }
      console.error("Erro ao buscar dados de Distribuicao", err);
      setError("Não foi possível carregar os dados de distribuição");
      setDistribuicaoData([]);
    });
  }, [navigate]);

  // 2) Função para selecionar imagem a partir de nomePadronizado ou tipo (fallback)
  const selectImageForElemento = (nomePadronizado, tipo) => {
    if (!nomePadronizado) return null;
    const keyLower = nomePadronizado.toLowerCase();
    // Tenta prefixos definidos
    for (const [prefix, img] of Object.entries(prefixImageMap)) {
      if (keyLower.startsWith(prefix.toLowerCase())) {
        return img;
      }
    }
    // Fallback por tipo, se desejar (exemplo):
    // const tipoImageMap = { VALVULA: valvula1Img, SENSOR: sensor1Img, BOMBA: bomba2Img, ... };
    // if (tipo && tipoImageMap[tipo]) return tipoImageMap[tipo];
    return null;
  };

  // 3) Quando distribuicaoData muda, converter em elementosData e inicializar/atualizar statusMap
  useEffect(() => {
    if (!Array.isArray(distribuicaoData) || distribuicaoData.length === 0) {
      setElementosData([]);
      setStatusMap({});
      return;
    }
    const novos = distribuicaoData.map(item => {
      const key = item.nomePadronizado;
      const label = item.nomePadronizado;
      // Parse posicaoNoLayout (string JSON) para { x, y, w, h }
      let coordsPx = { x: 0, y: 0, w: 0, h: 0 };
      if (typeof item.posicaoNoLayout === "string") {
        try {
          const parsed = JSON.parse(item.posicaoNoLayout);
          if (
            typeof parsed.x === "number" &&
            typeof parsed.y === "number" &&
            typeof parsed.w === "number" &&
            typeof parsed.h === "number"
          ) {
            coordsPx = { x: parsed.x, y: parsed.y, w: parsed.w, h: parsed.h };
          } else {
            console.warn(`posicaoNoLayout inválido para ${key}:`, parsed);
          }
        } catch (e) {
          console.warn(`Erro ao parsear posicaoNoLayout para ${key}:`, item.posicaoNoLayout, e);
        }
      } else {
        console.warn(`posicaoNoLayout não é string para ${key}:`, item.posicaoNoLayout);
      }
      const img = selectImageForElemento(item.nomePadronizado, item.tipo);
      // Retornamos também campos necessários para montar o DTO no PUT:
      return {
        id: item.id,
        key,
        label,
        coordsPx,
        img,
        statusEnum: item.statusEnum,       // string uppercase, ex: "ATIVO"
        endereco: item.endereco,
        tipo: item.tipo,                   // ex: "VALVULA"
        posicaoNoLayout: item.posicaoNoLayout // JSON string original
      };
    });
    setElementosData(novos);

    // Inicializar ou manter statusMap: converte statusEnum para lowercase local
    setStatusMap(prev => {
      const next = {};
      novos.forEach(el => {
        let initialStatus = STATUSES[0]; // "DESLIGADO"
        if (el.statusEnum && typeof el.statusEnum === "string") {
          const statusLower = el.statusEnum.toLowerCase();
          if (STATUSES.includes(statusLower)) {
            initialStatus = statusLower;
          }
        }
        next[el.key] = prev[el.key] || initialStatus;
      });
      return next;
    });
  }, [distribuicaoData]);

  // 4) Handler de clique: alterna status local e faz PUT /distribuicao com DTO completo
  const handleToggle = async (key, id) => {
    const current = statusMap[key] || STATUSES[0];
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    const nextStatusEnum = next.toUpperCase(); // para enviar ao backend

    // Encontrar item original em distribuicaoData
    const itemOriginal = distribuicaoData.find(item => item.id === id);
    if (!itemOriginal) {
      console.warn("Item não encontrado em distribuicaoData, id:", id);
      return;
    }
    // Montar DTO completo conforme DistribuicaoPlantaDto esperado pelo backend
    const dto = {
      id: itemOriginal.id,
      nomePadronizado: itemOriginal.nomePadronizado,
      endereco: itemOriginal.endereco,
      posicaoNoLayout: itemOriginal.posicaoNoLayout,
      tipo: itemOriginal.tipo,
      statusEnum: nextStatusEnum,
      // se o DTO tiver outros campos, inclua aqui também
    };

    // Otimistic update local
    setStatusMap(prev => ({ ...prev, [key]: next }));
    setUpdatingIds(prev => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setError("");

    try {
      // Chamada PUT para atualizar no backend: endpoint /distribuicao
      const response = await api.put("/distribuicao", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      // A resposta deve retornar o objeto atualizado
      const updated = response.data;
      // Atualiza distribuicaoData substituindo o item
      setDistribuicaoData(prev => prev.map(item => (item.id === id ? updated : item)));
      // Opcional: você pode querer re-definir statusMap baseado no updated.statusEnum,
      // mas o useEffect acima cuidará disso na próxima atualização de distribuicaoData.
    } catch (err) {
      console.error(`Erro ao atualizar status do elemento ${key} (id ${id}):`, err);
      // Reverter status local
      setStatusMap(prev => ({ ...prev, [key]: current }));
      setError(`Falha ao atualizar ${key}.`);
    } finally {
      setUpdatingIds(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  // Converte px para %
  const toPct = (px, total) => `${(px/total)*100}%`;

  // 5) Renderização
  return (
    <div className="relative w-full max-w-xl" style={{ aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}` }}>
      {error && (
        <div className="text-red-600 mb-2">{error}</div>
      )}
      {/* Fundo da distribuição */}
      <img
        src={distribuicaoImg}
        alt="Diagrama Distribuição"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* Overlays de elementos */}
      {elementosData.map(el => {
        const st = statusMap[el.key] || STATUSES[0];
        const { x, y, w, h } = el.coordsPx;
        if (!el.img) {
          // Se não há imagem definida, pulamos. Se quiser placeholder, retorne algo aqui.
          return null;
        }
        const isUpdating = updatingIds.has(el.id);
        return (
          <button
            key={el.key}
            onClick={() => {
              if (!isUpdating) {
                handleToggle(el.key, el.id);
              }
            }}
            aria-label={`${el.label} está ${st}`}
            disabled={isUpdating}
            style={{
              position: "absolute",
              left:   toPct(x, ORIGINAL_WIDTH),
              top:    toPct(y, ORIGINAL_HEIGHT),
              width:  toPct(w, ORIGINAL_WIDTH),
              height: toPct(h, ORIGINAL_HEIGHT),
              padding: 0,
              margin: 0,
              cursor: isUpdating ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isUpdating ? 0.6 : 1,
              // border: "1px dashed blue" // para debug
            }}
          >
            <img
              src={el.img}
              alt={el.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
                filter: filters[st],
                transition: "filter 0.3s",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
