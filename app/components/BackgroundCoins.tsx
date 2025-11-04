"use client";

import { useState, useEffect } from "react";

interface CoinProps {
  top: string;
  left: string;
  blur: number;
  opacity: number;
  size: number;
  rotation: number;
}

export default function BackgroundCoins() {
  const [coinProps, setCoinProps] = useState<CoinProps[]>([]);

  // Gerar posições e blur aleatórios para os símbolos $ de fundo
  const generateCoinProps = (count: number): CoinProps[] => {
    return Array.from({ length: count }, () => {
      // Concentrar mais nas laterais: 60% chance de estar nas bordas (0-15% ou 85-100%)
      const isLateral = Math.random() > 0.4;
      let left: number;
      if (isLateral) {
        // Nas laterais
        left =
          Math.random() > 0.5
            ? Math.random() * 15 // Lado esquerdo (0-15%)
            : 85 + Math.random() * 15; // Lado direito (85-100%)
      } else {
        // Meio ocasionalmente
        left = Math.random() * 100;
      }

      return {
        top: Math.random() * 100 + "%",
        left: left + "%",
        blur: Math.random() > 0.5 ? Math.random() * 8 + 2 : 0, // 50% chance de estar borrado
        opacity: Math.random() * 0.3 + 0.1, // Opacidade entre 0.1 e 0.4
        size: Math.random() * 60 + 30, // Tamanho entre 30px e 90px
        rotation: Math.random() * 360,
      };
    });
  };

  // Gerar os valores apenas no cliente após a montagem
  useEffect(() => {
    setCoinProps(generateCoinProps(20)); // 20 símbolos $
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {coinProps.map((coin, index) => (
        <span
          key={index}
          className="absolute font-bold"
          style={{
            top: coin.top,
            left: coin.left,
            color: "#c3d800",
            fontSize: `${coin.size}px`,
            filter: coin.blur > 0 ? `blur(${coin.blur}px)` : "none",
            opacity: coin.opacity,
            transform: `rotate(${coin.rotation}deg)`,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          $
        </span>
      ))}
    </div>
  );
}

