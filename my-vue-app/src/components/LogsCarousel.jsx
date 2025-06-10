import React from 'react';
import { Carousel } from 'antd';
import { LogProducao } from '../components/LogProducao';
import { LogArmazenamento } from '../components/LogArmazenamento';
import { LogAlarme } from '../components/Admin/LogAlarme';
import './carousel-overrides.css';

export function LogsCarousel({
  // props que serão repassadas para cada log
  fetchLogProducao,
  pageProd,
  totalPagesProd,
  dadosProd,

  fetchLogArmazenamento,
  pageArmazenamento,
  totalPagesArmazenamento,
  dadosArmazenamento,

  fetchLogAlarme,
  pageAlarme,
  totalPagesAlarme,
  dadosAlarme,
}) {
  return (
    <Carousel
      arrows
      infinite={false}
      className="custom-carousel"
      dotsClass="slick-dots custom-dots"
    >
      <div className="p-4">
        <LogProducao
          fetchLogProducao={fetchLogProducao}
          pageProd={pageProd}
          totalPagesProd={totalPagesProd}
          dadosProd={dadosProd}
        />
      </div>

      {/* Página 2: Armazenamento */}
      <div className="p-4">
        <LogArmazenamento
          fetchLogProducao={fetchLogArmazenamento}
          pageProd={pageArmazenamento}
          totalPagesProd={totalPagesArmazenamento}
          dadosArmazenamento={dadosArmazenamento}
        />
      </div>

      {/* Página 3: Alarme */}
      <div className="p-4">
        <LogAlarme
          fetchLogAlarme={fetchLogAlarme}
          pageAlarme={pageAlarme}
          totalPagesAlarme={totalPagesAlarme}
          dadosAlarme={dadosAlarme}
        />
      </div>
    </Carousel>
  );
}
