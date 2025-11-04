"use client";

import { useState } from "react";

interface CalculadoraProps {
  onVoltar: () => void;
}

export default function Calculadora({ onVoltar }: CalculadoraProps) {
  const [taxa, setTaxa] = useState("4,00");
  const [valorVenda, setValorVenda] = useState("1000");
  const [modalidade, setModalidade] = useState("Crédito 2-6x");
  const [bandeira, setBandeira] = useState("Amex");

  const taxaNumerica = parseFloat(taxa.replace(",", ".")) || 0;
  const taxaIndicada = 3.08;
  const valorVendaNumerico =
    parseFloat(valorVenda.replace(/\./g, "").replace(",", ".")) || 0;
  const valorTaxa = (valorVendaNumerico * taxaNumerica) / 100;
  const valorTaxaIndicada = (valorVendaNumerico * taxaIndicada) / 100;
  const economia = Math.max(0, valorTaxa - valorTaxaIndicada);

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números, vírgula e ponto
    const filtered = value.replace(/[^\d,.]/g, "");
    // Substitui ponto por vírgula para formato brasileiro
    const formatted = filtered.replace(".", ",");
    // Permite apenas uma vírgula
    const parts = formatted.split(",");
    if (parts.length > 2) {
      setTaxa(parts[0] + "," + parts.slice(1).join(""));
    } else {
      setTaxa(formatted);
    }
  };

  const handleValorVendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove tudo exceto números
    const numbersOnly = value.replace(/\D/g, "");
    // Formata com separador de milhar
    if (numbersOnly) {
      const formatted = parseInt(numbersOnly).toLocaleString("pt-BR");
      setValorVenda(formatted);
    } else {
      setValorVenda("");
    }
  };

  const modalidades = [
    "Débito",
    "Crédito Vista",
    "Crédito 2-6x",
    "Crédito 7-12x",
  ];
  const bandeiras = ["Master", "Visa", "Elo", "Amex", "Hiper"];

  return (
    <div className="space-y-4">
      {/* Cabeçalho com botão voltar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#103239]">Simulação</h2>
        <button
          onClick={onVoltar}
          className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90 bg-[#103239] text-white"
        >
          Tabela de economia
        </button>
      </div>

      {/* Banner Superior - Valor de Venda Editável */}
      <div className="rounded-lg p-3 lg:p-4 text-white bg-[#103239]">
        <label className="block mb-2 text-xs opacity-90">Você vende...</label>
        <input
          type="text"
          value={valorVenda}
          onChange={handleValorVendaChange}
          className="w-full bg-transparent border-none outline-none text-xl lg:text-2xl font-bold placeholder-white placeholder-opacity-50 text-white"
          placeholder="1.000"
        />
      </div>

      {/* Campos de Taxa */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sua Taxa */}
        <div>
          <label className="block mb-2 font-semibold text-sm text-[#103239]">
            Sua Taxa
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
            <input
              type="text"
              value={taxa}
              onChange={handleTaxaChange}
              className="w-full"
              placeholder="4,00"
            />
            <span className="font-bold text-lg whitespace-nowrap text-[#103239]">
              %
            </span>
          </div>
        </div>

        {/* Taxa Indicada */}
        <div>
          <label className="block mb-2 font-semibold text-sm text-[#103239]">
            Taxa Indicada
          </label>
          <div className="flex items-center">
            <span className="text-2xl lg:text-3xl font-bold text-[#c3d800]">
              {taxaIndicada.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Modalidade e Bandeira */}
      <div className="grid grid-cols-2 gap-4">
        {/* Seção Modalidade */}
        <div>
          <label className="block font-semibold mb-2 text-sm text-[#103239]">
            Modalidade
          </label>
          <div className="flex flex-wrap gap-2 items-start">
            {modalidades.map((mod) => (
              <button
                key={mod}
                onClick={() => setModalidade(mod)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  modalidade === mod
                    ? "text-white bg-[#103239]"
                    : "bg-white border border-[#103239] border-[1.5px] text-[#103239] hover:opacity-80"
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Seção Bandeira */}
        <div>
          <label className="block font-semibold mb-2 text-sm text-[#103239]">
            Bandeira
          </label>
          <div className="flex flex-wrap gap-2 items-start">
            {bandeiras.map((band) => (
              <button
                key={band}
                onClick={() => setBandeira(band)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  bandeira === band
                    ? "text-white bg-[#103239]"
                    : "bg-white border border-[#103239] border-[1.5px] text-[#103239] hover:opacity-80"
                }`}
              >
                {band}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Caixas de Valores */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sua taxa */}
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs mb-1 font-medium text-[#103239] opacity-70">
            Sua taxa
          </p>
          <p className="text-lg lg:text-xl font-bold text-[#103239]">
            R${" "}
            {valorTaxa.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Taxa indicada */}
        <div className="rounded-lg p-3 bg-[#c3d800]">
          <p className="text-xs mb-1 font-medium text-[#103239]">
            Taxa indicada
          </p>
          <p className="text-lg lg:text-xl font-bold text-[#103239]">
            R${" "}
            {valorTaxaIndicada.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Sua economia */}
      <div className="rounded-lg p-4 bg-[#c3d800]">
        <p className="text-xs mb-0.5 font-medium text-[#103239]">
          Sua economia
        </p>
        <p className="text-xs mb-2 text-[#103239] opacity-70">Por transação</p>
        <p className="text-2xl lg:text-3xl font-bold text-[#103239]">
          R${" "}
          {economia.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
