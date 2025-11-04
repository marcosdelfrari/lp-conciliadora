"use client";

import { ChevronRightIcon } from "lucide-react";

interface HeroSectionProps {
  onSimularVendas: () => void;
  mostrarBotao?: boolean;
  mostrarBotaoMobile?: boolean;
}

export default function HeroSection({
  onSimularVendas,
  mostrarBotao = true,
  mostrarBotaoMobile = false,
}: HeroSectionProps) {
  return (
    <div className="flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-14 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0">
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#103239] leading-tight">
          Pare de perder dinheiro com taxas altas
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#103239] leading-relaxed">
          Compara suas condições atuais e descubra qual adquirente oferece o
          melhor custo para o seu negócio.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="relative hidden sm:block">
            <svg
              className="absolute right-[45%] -top-[70px]"
              xmlns="http://www.w3.org/2000/svg"
              width="139"
              height="124"
              viewBox="0 0 139 124"
              fill="none"
            >
              <path
                d="M82.8343 2.44531L1.04297 37.3531C1.04297 37.3531 135.476 16.9902 135.476 65.7585C135.476 93.0196 69.8026 94.6773 69.8026 94.6773"
                stroke="white"
                strokeWidth="5.31355"
                fill="none"
              ></path>
              <path
                d="M69.8026 94.6773L96.3833 64.8322"
                stroke="white"
                strokeWidth="5.31355"
                fill="none"
              ></path>
              <path
                d="M69.8026 94.6773L99.7093 121.203"
                stroke="white"
                strokeWidth="5.31355"
                fill="none"
              ></path>
            </svg>
          </div>
          {/* Desktop: sempre mostra se mostrarBotao for true */}
          {/* Mobile: só mostra se mostrarBotaoMobile for true (quando quiz completo) */}
          {mostrarBotao && (
            <a
              className="hidden lg:flex text-sm sm:text-base duration-300 transition-all font-light tracking-wide gap-2 items-center py-2.5 sm:py-3 px-4 sm:px-5 w-fit rounded-full bg-[#103239] hover:bg-[#244C4E] hover:text-white text-[#c3d800] justify-start"
              href="/login"
              target="_blank"
            >
              Garanta essa taxa
              <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          )}
          {mostrarBotaoMobile && (
            <a
              className="flex lg:hidden text-sm sm:text-base duration-300 transition-all font-light tracking-wide gap-2 items-center py-2.5 sm:py-3 px-4 sm:px-5 w-full rounded-full bg-[#103239] hover:bg-[#244C4E] hover:text-white text-[#c3d800] justify-center"
              href="/login"
              target="_blank"
            >
              Garanta essa taxa
              <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
