"use client";

import { useState } from "react";
import Quiz from "./components/Quiz";
import BackgroundCoins from "./components/BackgroundCoins";
import HeroSection from "./components/HeroSection";
import SavingsCarousel from "./components/SavingsCarousel";
import Footer from "./components/Footer";
import { TabelaService } from "./services/tabelaService";

export default function Home() {
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  // Processa os dados mockados de transações por adquirente
  // Cada adquirente terá sua própria tabela de economia no carousel
  const tabelaDataPorAdquirente =
    TabelaService.processarTransacoesPorAdquirente();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#103239] relative overflow-hidden">
      <BackgroundCoins />

      <div className="container mx-auto px-4 py-12 max-w-7xl w-full relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#c3d800] h-[600px] rounded-4xl relative z-10">
          {/* Coluna Esquerda */}
          <HeroSection onSimularVendas={() => setMostrarCalculadora(true)} />

          {/* Coluna Direita - Tabela/Calculadora */}
          <div className="rounded-xl space-y-4 bg-gray-100">
            {!mostrarCalculadora ? (
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
