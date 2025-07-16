import React from 'react';

export function Teste() {
  return (
    <div className="flex flex-col min-h-screen font-inter text-gray-800">

      {/* Hero Section */}
      <section
        id="home"
        className="bg-white flex flex-col-reverse lg:flex-row items-center container mx-auto px-6 lg:px-20 py-20 gap-12 flex-1"
      >
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Segurança e Saúde Ocupacional de Forma Simples
          </h1>
          <p className="text-lg text-gray-600">
            Plataforma completa para gestão de documentos, monitoramento de indicadores e conformidade legal.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="#criar-conta"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-500 transition"
            >
              Comece Gratuitamente
            </a>
            <a href="#saiba-mais" className="text-blue-600 font-medium hover:underline">
              Saiba Mais
            </a>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://via.placeholder.com/600x450"
            alt="Dashboard HealthSafe"
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-16">
        <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white">Sobre Nós</a></li>
              <li><a href="#blog" className="hover:text-white">Blog</a></li>
              <li><a href="#careers" className="hover:text-white">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#docs" className="hover:text-white">Documentação</a></li>
              <li><a href="#support" className="hover:text-white">Suporte</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: suporte@healthsafe.com.br</li>
              <li>Telefone: (11) 1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-12 text-gray-500">
          &copy; 2025 HealthSafe. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
