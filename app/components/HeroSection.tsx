"use client";

import { ChevronRightIcon } from "lucide-react";

interface HeroSectionProps {
  onSimularVendas: () => void;
}

export default function HeroSection({ onSimularVendas }: HeroSectionProps) {
  return (
    <div className="flex flex-col justify-center space-y-14 px-4 lg:px-12">
      <div className="space-y-3">
        <h1 className="text-5xl lg:text-6xl font-bold text-[#103239]">
          Pare de perder dinheiro com taxas altas
        </h1>

        <p className="text-xl lg:text-2xl text-[#103239]">
          Compara suas condições atuais e descubra qual adquirente oferece o
          melhor custo para o seu negócio.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="relative">
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
          <a
            className="text-[16px] duration-300 transition-all font-light tracking-wide flex gap-2 items-center py-3 px-4 w-fit rounded-full bg-[#103239] hover:bg-[#244C4E] hover:text-white text-[#c3d800]"
            href="/login"
            target="_blank"
          >
            Garanta essa taxa
            <ChevronRightIcon className="w-6 h-6" />
          </a>
        
       
        </div>
      </div>
    </div>
  );
}

