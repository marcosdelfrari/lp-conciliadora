"use client";

import { useState, useRef } from "react";
import SavingsTable from "./SavingsTable";
import { TabelaRow } from "../types";

interface SavingsCarouselProps {
  items: Array<{ nome: string; data: TabelaRow[] }>;
}

export default function SavingsCarousel({ items }: SavingsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // A distância mínima para considerar um swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {/* Container do carousel */}
      <div
        ref={carouselRef}
        className="overflow-hidden h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              {/* Tabela de economia */}
              <div className="h-[calc(100%-60px)] overflow-y-auto">
                <SavingsTable data={item.data} nome={item.nome} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores (dots) */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "bg-[#103239] w-8 h-2"
                  : "bg-[#103239] opacity-40 w-2 h-2"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
