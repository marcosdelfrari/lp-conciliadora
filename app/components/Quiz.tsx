"use client";

import { useState, useRef, useEffect } from "react";
import CustomSelect, { SelectOption } from "./CustomSelect";
import CustomInput from "./CustomInput";

interface QuizSimulacaoProps {
  onVoltar?: () => void;
}

export default function QuizSimulacao({ onVoltar }: QuizSimulacaoProps = {}) {
  const [step, setStep] = useState(1);
  const [valorVenda, setValorVenda] = useState(1000);
  const [suaTaxa, setSuaTaxa] = useState(4.0);
  const [taxaIndicada] = useState(3.08);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [bandeira, setBandeira] = useState<string | null>(null);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [editingCampo, setEditingCampo] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const campoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showTaxaModal, setShowTaxaModal] = useState(false);
  const [novaTaxa, setNovaTaxa] = useState(suaTaxa);
  const taxaInputRef = useRef<HTMLDivElement>(null);

  const calcularValores = (taxa: number) => {
    return (valorVenda * taxa) / 100;
  };

  const abrirPopover = (campo: string, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setEditingCampo(campo);
  };

  const fecharPopover = () => {
    setEditingCampo(null);
    setPopoverPosition(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCampo && popoverPosition) {
        const target = event.target as HTMLElement;
        if (
          !target.closest(".popover-container") &&
          !target.closest("[data-campo]")
        ) {
          fecharPopover();
        }
      }
    };

    if (editingCampo) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingCampo, popoverPosition]);

  useEffect(() => {
    if (showTaxaModal && taxaInputRef.current) {
      taxaInputRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(taxaInputRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [showTaxaModal]);

  const modalidades = [
    { id: "debito", label: "Débito" },
    { id: "credito-vista", label: "Crédito Vista" },
    { id: "credito-2-6x", label: "Crédito 2-6x" },
    { id: "credito-7-12x", label: "Crédito 7-12x" },
  ];

  const bandeiras = [
    { id: "master", label: "Master" },
    { id: "visa", label: "Visa" },
    { id: "elo", label: "Elo" },
    { id: "amex", label: "Amex" },
    { id: "hiper", label: "Hiper" },
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setValorVenda(1000);
    setSuaTaxa(4.0);
    setModalidade(null);
    setBandeira(null);
    setEscolha(null);
  };

  const handleTestarTaxa = () => {
    setEscolha("testar");
    setStep(6);
  };

  const handleRefazer = () => {
    handleReset();
  };

  const handleAbrirModalTaxa = () => {
    setNovaTaxa(suaTaxa);
    setShowTaxaModal(true);
  };

  const handleConfirmarTaxa = (valorFinal?: number) => {
    const valorParaUsar = valorFinal !== undefined ? valorFinal : novaTaxa;
    setSuaTaxa(valorParaUsar);
    setShowTaxaModal(false);
  };

  const handleCancelarTaxa = () => {
    setNovaTaxa(suaTaxa);
    setShowTaxaModal(false);
  };

  return (
    <div className="bg-white w-full h-full rounded-xl relative flex flex-col items-center justify-center">
      <div className=" mx-auto rounded-xl w-full ">
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2"></div>
          <p className="text-xs text-gray-500 text-center">
            {step === 1 && "Etapa 1: Valor da venda"}
            {step === 2 && "Etapa 2: Sua modalidade"}
            {step === 3 && "Etapa 3: Sua bandeira"}
            {step === 4 && "Etapa 4: Resultado"}
            {step === 5 && "Etapa 5: Próximos passos"}
            {step === 6 && "Insira sua taxa"}
            {step === 7 && "Comparação de taxas"}
          </p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Qual o valor da venda?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Insira o valor da transação que deseja simular.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Valor da venda
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  R$
                </span>
                <input
                  type="number"
                  value={valorVenda}
                  onChange={(e) => setValorVenda(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-base font-semibold"
                  placeholder="1000"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!valorVenda || valorVenda <= 0}
              className="w-full mt-4 text-white py-2 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              style={{ backgroundColor: "#d10339" }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "#c3d800";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "#d10339";
                }
              }}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Qual a modalidade?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Selecione a forma de pagamento.
            </p>

            <div className="space-y-2">
              {modalidades.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setModalidade(mod.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    modalidade === mod.id
                      ? "bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={
                    modalidade === mod.id
                      ? { borderColor: "#d10339", borderWidth: "2px" }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {mod.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        modalidade === mod.id ? "" : "border-gray-300"
                      }`}
                      style={
                        modalidade === mod.id
                          ? {
                              borderColor: "#d10339",
                              backgroundColor: "#d10339",
                            }
                          : {}
                      }
                    >
                      {modalidade === mod.id && (
                        <svg
                          className="w-full h-full text-white p-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                disabled={!modalidade}
                className="flex-1 text-white py-2 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: "#d10339" }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#c3d800";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#d10339";
                  }
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Qual a bandeira?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Selecione a bandeira do cartão.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {bandeiras.map((band) => (
                <button
                  key={band.id}
                  onClick={() => setBandeira(band.id)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    bandeira === band.id
                      ? "bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={
                    bandeira === band.id
                      ? { borderColor: "#d10339", borderWidth: "2px" }
                      : {}
                  }
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {band.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        bandeira === band.id ? "" : "border-gray-300"
                      }`}
                      style={
                        bandeira === band.id
                          ? {
                              borderColor: "#d10339",
                              backgroundColor: "#d10339",
                            }
                          : {}
                      }
                    >
                      {bandeira === band.id && (
                        <svg
                          className="w-full h-full text-white p-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                disabled={!bandeira}
                className="flex-1 text-white py-2 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: "#d10339" }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#c3d800";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#d10339";
                  }
                }}
              >
                Ver Resultado
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className=" rounded-lg p-4 transition-all">
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Valor da venda
                </p>
                <CustomInput
                  value={valorVenda}
                  onChange={(value) => setValorVenda(value)}
                  label="Valor da venda"
                  prefix="R$"
                  type="number"
                  step="0.01"
                  min={0}
                  textSize="xl"
                  formatValue={(val) =>
                    val.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Modalidade
                  </p>
                  <CustomSelect
                    value={modalidade}
                    options={modalidades}
                    onChange={(value) => setModalidade(value)}
                    placeholder="Clique para editar"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Bandeira
                  </p>
                  <CustomSelect
                    value={bandeira}
                    options={bandeiras}
                    onChange={(value) => setBandeira(value)}
                    placeholder="Clique para editar"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 ">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Sua taxa atual
                </p>
                <p className="text-2xl font-bold mb-1 text-gray-900">
                  {suaTaxa}%
                </p>
                <p className="text-sm text-gray-600">
                  R${" "}
                  {calcularValores(suaTaxa).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div
                className="rounded-lg p-4 text-white"
                style={{ backgroundColor: "#d10339" }}
              >
                <p className="text-xs font-semibold opacity-90 uppercase tracking-wide mb-2">
                  Taxa indicada
                </p>
                <p className="text-2xl font-bold mb-1">{taxaIndicada}%</p>
                <p className="text-sm opacity-75">
                  R${" "}
                  {calcularValores(taxaIndicada).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <button
                onClick={handleAbrirModalTaxa}
                className=" rounded-full cursor-pointer  text-sm  text-right tracking-wide transition-opacity hover:opacity-90 text-gray-500 underline text-left"
              >
                Altera a taxa
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              O que deseja fazer?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Escolha uma das opções abaixo.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleTestarTaxa}
                className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">
                      Testar com taxa diferente
                    </p>
                    <p className="text-xs text-gray-600">
                      Compare com sua taxa atual
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-black transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleRefazer}
                className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">
                      Refazer simulação
                    </p>
                    <p className="text-xs text-gray-600">
                      Começar uma nova simulação do zero
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-black transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Qual sua taxa atual?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Insira a taxa que você paga atualmente para compararmos.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sua taxa atual (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={suaTaxa}
                  onChange={(e) => setSuaTaxa(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-base font-semibold pr-10"
                  placeholder="4.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  %
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(5)}
                className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                disabled={!suaTaxa || suaTaxa <= 0}
                className="flex-1 text-white py-2 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: "#d10339" }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#c3d800";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#d10339";
                  }
                }}
              >
                Ver Comparação
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="bg-white rounded-lg p-4 transition-all">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Comparação de taxas
              </h2>
              <p className="text-sm text-gray-600">
                Veja quanto você pode economizar
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
                <p className="text-xs font-semibold text-red-700 mb-0.5">
                  Sua taxa atual ({suaTaxa}%)
                </p>
                <p className="text-xl font-bold text-red-600">
                  R$ {calcularValores(suaTaxa).toFixed(2)}
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Valor que você paga por transação
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-0.5">
                  Taxa indicada ({taxaIndicada}%)
                </p>
                <p className="text-xl font-bold text-green-600">
                  R$ {calcularValores(taxaIndicada).toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Valor que você pagaria
                </p>
              </div>

              <div
                className="rounded-lg p-3 text-white"
                style={{ backgroundColor: "#d10339" }}
              >
                <p className="text-xs font-semibold mb-0.5 opacity-90">
                  Economia por transação
                </p>
                <p className="text-2xl font-bold">
                  R${" "}
                  {(
                    calcularValores(suaTaxa) - calcularValores(taxaIndicada)
                  ).toFixed(2)}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Economia anual estimada: R${" "}
                  {(
                    (calcularValores(suaTaxa) - calcularValores(taxaIndicada)) *
                    12
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setStep(5)}
                className="w-full text-white py-2 rounded-lg font-semibold transition-all text-sm"
                style={{ backgroundColor: "#d10339" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c3d800";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#d10339";
                }}
              >
                Testar outra taxa
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                Fazer nova simulação
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Alteração de Taxa */}
      {showTaxaModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm "
          onClick={handleCancelarTaxa}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Alterar Taxa
            </h3>

            <div className="flex items-center gap-2 border-b-2 border-gray-200 ">
              <div
                ref={taxaInputRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const text = e.currentTarget.textContent || "";
                  const cleaned = text.replace(/[^\d.,]/g, "");

                  if (text !== cleaned) {
                    e.currentTarget.textContent = cleaned;
                    // Mantém o cursor no final
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(e.currentTarget);
                    range.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                  }
                }}
                onBlur={(e) => {
                  const text = e.currentTarget.textContent || "";
                  const numValue = parseFloat(text.replace(",", ".")) || 0;
                  setNovaTaxa(numValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const text = e.currentTarget.textContent || "";
                    const numValue = parseFloat(text.replace(",", ".")) || 0;
                    handleConfirmarTaxa(numValue);
                  }
                }}
                className="flex-1 rounded-lg   text-2xl font-bold text-gray-900 focus:outline-none focus:ring-0 focus:ring-black min-w-0"
              >
                {novaTaxa}
              </div>
              <span className="text-2xl font-bold text-gray-500">%</span>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancelarTaxa}
                className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const text = taxaInputRef.current?.textContent || "";
                  const numValue =
                    parseFloat(text.replace(",", ".")) || novaTaxa;
                  handleConfirmarTaxa(numValue);
                }}
                className="flex-1 text-white py-3 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: "#d10339" }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#c3d800";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "#d10339";
                  }
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
