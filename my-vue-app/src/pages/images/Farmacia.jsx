import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import farmaciaImg from "./Tudo/farmacia.png";
import valvula1Img from "./Tudo/valvula1.png";
import valvula2Img from "./Tudo/valvula2.png";
import sensor1Img from "./Tudo/sensor1.png";
import sensor2Img from "./Tudo/sensor2.png";
import bombaImg from "./Tudo/bomba.png";
import barra1Img from "./Tudo/barra1.png";
import barra2Img from "./Tudo/barra2.png";

const ORIGINAL_WIDTH = 591;
const ORIGINAL_HEIGHT = 435;

// Ciclo de status local
const STATUSES = [
  "desligado",
  "ativo",
  "manutencao",
  "estragado",
];

// Filtros CSS mapeados
const filters = {
  desligado:  "none",
  ativo:      "grayscale(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)",
  manutencao: "grayscale(1) sepia(1) saturate(8) hue-rotate(0deg) brightness(1.2) contrast(1.2)",
  estragado:  "grayscale(1) brightness(0.2)",
};

// Mapeamento de prefixos de nomePadronizado para imagem
const prefixImageMap = {
  "valvula1": valvula1Img,
  "valvula2": valvula2Img,
  "sensor1":  sensor1Img,
  "sensor2":  sensor2Img,
  "bomba":    bombaImg,
  "nivel_ta": barra1Img,
  "nivel_tm": barra2Img,
};

// Fallback por tipo, se desejar
const tipoImageMap = {
  VALVULA: valvula1Img,
  SENSOR:  sensor1Img,
  BOMBA:   bombaImg,
  INDICADOR_VOLUME: barra1Img,
};

export function Farmacia() {
  const navigate = useNavigate();
  // estado com dados brutos vindos da API (array de objetos com id, nomePadronizado, endereco, posicaoNoLayout, tipo, statusEnum, ...)
  const [farmacia, setFarmacia] = useState([]);
  // array de elementos transformados para render: { id, key, label, coordsPx, img, statusEnum }
  const [elementosData, setElementosData] = useState([]);
  // status local por key (lowercase): usado para filtro visual em STATUSES
  const [statusMap, setStatusMap] = useState({});
  const [error, setError] = useState("");
  // conjunto de ids em atualização, para desabilitar clique enquanto PUT pendente
  const [updatingIds, setUpdatingIds] = useState(new Set());

  // 1) Fetch inicial dos dados
  useEffect(() => {
    api.get("/farmacia", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      const data = response.data;
      if (Array.isArray(data)) {
        setFarmacia(data);
      } else {
        console.warn("Resposta /farmacia não é array:", data);
        setFarmacia([]);
      }
    })
    .catch(err => {
      if (err.response?.status === 401) {
        navigate('/login');
      }
      console.error("Erro ao buscar dados", err);
      setError("Não foi possível carregar os dados");
      setFarmacia([]);
    });
  }, [navigate]);

  // 2) Função para escolher imagem a partir de nomePadronizado ou tipo
  const selectImageForElemento = (nomePadronizado, tipo) => {
    if (!nomePadronizado) return null;
    const keyLower = nomePadronizado.toLowerCase();
    for (const [prefix, img] of Object.entries(prefixImageMap)) {
      if (keyLower.startsWith(prefix.toLowerCase())) {
        return img;
      }
    }
    if (tipo && tipoImageMap[tipo]) {
      return tipoImageMap[tipo];
    }
    return null;
  };

  // 3) Quando muda o estado `farmacia`, converte em `elementosData` e inicializa/atualiza statusMap
  useEffect(() => {
    if (!Array.isArray(farmacia) || farmacia.length === 0) {
      setElementosData([]);
      setStatusMap({});
      return;
    }
    const novos = farmacia.map(item => {
      const key = item.nomePadronizado;
      const label = item.nomePadronizado;
      // parse posicaoNoLayout (string JSON) para { x, y, w, h }
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
      // item.statusEnum vem do backend, ex: "ATIVO", "DESLIGADO"...
      return { 
        id: item.id, 
        key, 
        label, 
        coordsPx, 
        img, 
        statusEnum: item.statusEnum 
      };
    });
    setElementosData(novos);

    // Inicializar ou manter statusMap: converte statusEnum (uppercase) para lowercase em STATUSES
    setStatusMap(prev => {
      const next = {};
      novos.forEach(el => {
        let initialStatus = STATUSES[0]; // "desligado"
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
  }, [farmacia]);

  // 4) Handler de clique: alterna status local e faz PUT /farmacia com DTO completo
  const handleToggle = async (key, id) => {
    const current = statusMap[key] || STATUSES[0];
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    // converte p/ uppercase para enviar ao backend
    const nextStatusEnum = next.toUpperCase();

    // encontrar item original em farmacia
    const itemOriginal = farmacia.find(item => item.id === id);
    if (!itemOriginal) {
      console.warn("Item não encontrado em state farmacia, id:", id);
      return;
    }
    // Monta DTO completo: tem que incluir todos os campos que o endpoint espera
    const dto = {
      id: itemOriginal.id,
      nomePadronizado: itemOriginal.nomePadronizado,
      endereco: itemOriginal.endereco,
      posicaoNoLayout: itemOriginal.posicaoNoLayout,
      tipo: itemOriginal.tipo,
      statusEnum: nextStatusEnum,
      // Se houver outros campos no DTO, inclua aqui também, por ex. descrição, etc.
    };

    // Otimistic update local
    setStatusMap(prev => ({ ...prev, [key]: next }));
    setUpdatingIds(prev => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });

    try {
      // Chama PUT /farmacia com o DTO completo
      const response = await api.put("/farmacia", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      // A resposta retorna o objeto atualizado:
      const updated = response.data;
      // Atualiza o estado farmacia substituindo o item
      setFarmacia(prev => prev.map(item => item.id === id ? updated : item));
      // error limpa se tiver algum
      setError("");
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

  // conversão px → %
  const toPct = (px, total) => `${(px/total)*100}%`;

  // 5) Renderização
  return (
    <div className="relative w-full max-w-xl" style={{ aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}` }}>
      {error && (
        <div className="text-red-600 mb-2">{error}</div>
      )}
      {/* Fundo da planta */}
      <img
        src={farmaciaImg}
        alt="Diagrama Farmácia"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Overlays de elementos */}
      {elementosData.map(el => {
        const st = statusMap[el.key] || STATUSES[0];
        const { x, y, w, h } = el.coordsPx;
        if (!el.img) {
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
