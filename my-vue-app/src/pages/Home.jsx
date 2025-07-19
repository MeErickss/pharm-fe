import { useState, useEffect } from "react";
import farmacia from "./images/farmacia.png";
import filtros from "./images/filtros.png";
import purifier from "./images/purifier.png";

export function Home() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full w-full rounded-lg bg-white font-inter text-gray-800 overflow-y-auto">

      {/* Hero Section */}
      <section
        id="home"
        className="bg-white flex flex-col-reverse lg:flex-row items-center container mx-auto px-6 lg:px-20 py-24 gap-16"
      >
        <div className="lg:w-1/2 space-y-8 border-b-2 pb-4 border-neutral-300">
        <h1 className="text-6xl text-indigo-500 font-mono font-bold text-center">Health Safe</h1>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
            Segurança e Saúde Ocupacional de Forma Simples
          </h1>
          <p className="text-lg text-gray-600">
            Plataforma completa para gestão de documentos, monitoramento de indicadores e conformidade legal.
          </p>
          <a
            href="http://healthsafe.com.br/"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-500 transition"
          >
            Saiba Mais
          </a>
        </div>
        <div className="lg:w-1/2 rounded-lg">
          <div className="w-full h-72 lg:h-96 rounded-xl overflow-hidden shadow-xl">
            <iframe
              title="HealthSafe - Vila Mangalot"
              className="w-full h-full"
              src="https://maps.google.com/maps?q=-23.4893194,-46.743483&z=15&output=embed"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white rounded-b-lg">
        <div className="container mx-auto h-full w-full p-6 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              title: 'Gestão de Documentos',
              desc: 'Armazene e organize todos os documentos de SST em um só lugar, com acesso rápido e seguro.'
            },
            {
              title: 'Monitoramento de Indicadores',
              desc: 'Acompanhe métricas de acidentes, treinamentos e conformidades em dashboards intuitivos.'
            },
            {
              title: 'Alertas Automáticos',
              desc: 'Receba notificações sobre vencimentos de laudos e treinamentos para evitar multas e riscos.'
            },
            {
              title: 'Relatórios Customizados',
              desc: 'Gere relatórios detalhados para auditorias internas e externas com apenas alguns cliques.'
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
