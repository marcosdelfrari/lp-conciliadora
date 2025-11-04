"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Quiz from "./components/Quiz";
import BackgroundCoins from "./components/BackgroundCoins";
import HeroSection from "./components/HeroSection";
import SavingsCarousel from "./components/SavingsCarousel";
import Footer from "./components/Footer";
import { TabelaService } from "./services/tabelaService";
import { UrlService } from "./services/urlService";

export default function Home() {
  const searchParams = useSearchParams();
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  // Verifica se deve exibir o app (SavingsCarousel) ou o Quiz baseado no parâmetro da URL
  const exibirApp = UrlService.deveExibirApp(searchParams);

  // Processa os dados mockados de transações por adquirente
  // Cada adquirente terá sua própria tabela de economia no carousel
  const tabelaDataPorAdquirente =
    TabelaService.processarTransacoesPorAdquirente();

  // Lógica baseada no parâmetro da URL:
  // - Sem parâmetro ou ?app!=true → mostra Quiz
  // - Com ?app=true → mostra SavingsCarousel
  const deveExibirSavingsCarousel = exibirApp;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#103239] relative md:overflow-hidden">
      <BackgroundCoins />

      <div className="container mx-auto px-4 py-12 max-w-7xl w-full relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#c3d800] min-h-[600px] rounded-4xl relative z-10">
          {/* Coluna Esquerda */}
          <HeroSection onSimularVendas={() => setMostrarCalculadora(true)} />

          {/* Coluna Direita - Tabela/Calculadora */}
          <div className="rounded-xl space-y-4 bg-gray-100 overflow-hidden">
            {deveExibirSavingsCarousel ? (
              <SavingsCarousel items={tabelaDataPorAdquirente} />
            ) : (
              <Quiz onVoltar={() => setMostrarCalculadora(false)} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
