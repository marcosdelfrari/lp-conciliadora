"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Quiz from "./components/Quiz";
import BackgroundCoins from "./components/BackgroundCoins";
import HeroSection from "./components/HeroSection";
import SavingsCarousel from "./components/SavingsCarousel";
import Footer from "./components/Footer";
import { TabelaService } from "./services/tabelaService";
import { UrlService } from "./services/urlService";

function HomeContent() {
  const searchParams = useSearchParams();
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [quizCompleto, setQuizCompleto] = useState(false);
  const lastRefoIdRef = useRef<string | null>(null);

  // Monitora o RefoId no localStorage
  useEffect(() => {
    // Verifica o RefoId inicial
    const refoId = localStorage.getItem("RefoIds");
    lastRefoIdRef.current = refoId;
    console.log("RefoId inicial:", refoId);

    // Listener para mudanças no localStorage (funciona entre abas/janelas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "RefoIds") {
        lastRefoIdRef.current = e.newValue;
        console.log("RefoId atualizado (storage event):", e.newValue);
      }
    };

    // Listener para mudanças no mesmo contexto (quando o banner modifica diretamente)
    const checkRefoId = () => {
      const currentRefoId = localStorage.getItem("RefoIds");
      if (currentRefoId !== lastRefoIdRef.current) {
        console.log("RefoId mudou para:", currentRefoId);
        lastRefoIdRef.current = currentRefoId;
      }
    };

    // Adiciona listeners
    window.addEventListener("storage", handleStorageChange);

    // Verifica periodicamente para capturar mudanças no mesmo contexto
    const intervalId = setInterval(checkRefoId, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

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

      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-12 max-w-7xl w-full relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#c3d800] min-h-[500px] sm:min-h-[600px] rounded-2xl sm:rounded-4xl relative z-10 overflow-hidden">
          {/* Em mobile: quando for Quiz, inverte a ordem (Quiz primeiro, Hero depois) */}
          {/* Em desktop: Hero primeiro, Quiz depois */}
          {deveExibirSavingsCarousel ? (
            <>
              {/* Coluna Esquerda - Hero */}
              <HeroSection
                onSimularVendas={() => setMostrarCalculadora(true)}
                mostrarBotao={true}
              />

              {/* Coluna Direita - Carousel */}
              <div className="rounded-xl sm:rounded-xl space-y-4 bg-gray-100 overflow-hidden relative">
                <SavingsCarousel items={tabelaDataPorAdquirente} />
              </div>
            </>
          ) : (
            <>
              {/* Container do Quiz e botão - primeiro em mobile, segundo em desktop */}
              <div className="order-1 lg:order-2 space-y-4">
                {/* Quiz */}
                <div className="rounded-xl sm:rounded-xl bg-gray-100 overflow-hidden relative h-full">
                  <Quiz
                    onVoltar={() => setMostrarCalculadora(false)}
                    onQuizCompleto={() => {
                      console.log("Quiz completo! Mostrando botão...");
                      setQuizCompleto(true);
                    }}
                    onQuizReset={() => {
                      console.log("Quiz resetado! Escondendo botão...");
                      setQuizCompleto(false);
                    }}
                  />
                </div>
              </div>

              {/* Hero segundo em mobile, primeiro em desktop */}
              <div className="order-2 lg:order-1 flex flex-col items-center justify-center">
                <HeroSection
                  onSimularVendas={() => setMostrarCalculadora(true)}
                  mostrarBotao={true}
                  mostrarBotaoMobile={quizCompleto}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#103239]">
          <div className="text-white">Carregando...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
