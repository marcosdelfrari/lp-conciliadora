"use client";

import { useState, useRef, useEffect } from "react";

export interface CustomInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "number" | "text";
  step?: string;
  min?: number;
  max?: number;
  formatValue?: (value: number) => string;
  textSize?: "base" | "xl" | "2xl";
}

export default function CustomInput({
  value,
  onChange,
  label,
  prefix,
  suffix,
  placeholder = "0",
  disabled = false,
  type = "number",
  step = "0.01",
  min = 0,
  max,
  formatValue,
  textSize = "base",
}: CustomInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputFieldRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef<string>(value.toString());

  useEffect(() => {
    if (!isEditing) {
      // Usa o valor numérico direto, sem formatação
      const plainValue = value.toString().replace(",", ".");
      setInputValue(plainValue);
      initialValueRef.current = plainValue;
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputFieldRef.current) {
      // Define o conteúdo inicial quando entrar no modo de edição
      // Remove formatação e usa apenas o valor numérico puro
      let plainValue = initialValueRef.current.replace(/[^\d.,-]/g, "");
      // Remove vírgulas extras e mantém apenas uma
      const parts = plainValue.split(",");
      if (parts.length > 2) {
        plainValue = parts[0] + "," + parts.slice(1).join("");
      }
      // Remove pontos extras (exceto se houver vírgula, então mantém vírgula)
      if (plainValue.includes(",")) {
        plainValue = plainValue.replace(/\./g, "");
      } else {
        const dotParts = plainValue.split(".");
        if (dotParts.length > 2) {
          plainValue = dotParts[0] + "." + dotParts.slice(1).join("");
        }
      }

      inputFieldRef.current.textContent = plainValue;
      inputFieldRef.current.focus();
      // Seleciona todo o texto no contentEditable para substituição ao digitar
      const range = document.createRange();
      range.selectNodeContents(inputFieldRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleConfirm = () => {
    // Pega o valor diretamente do contentEditable
    const currentText = inputFieldRef.current?.textContent || "";
    // Remove espaços e caracteres não numéricos (exceto vírgula e ponto)
    const cleaned = currentText.trim().replace(/[^\d.,-]/g, "");

    if (!cleaned || cleaned === "") {
      onChange(min !== undefined ? min : 0);
      setIsEditing(false);
      return;
    }

    // Converte vírgula para ponto para parsing
    const normalized = cleaned.replace(",", ".");
    const numValue = parseFloat(normalized) || 0;
    const finalValue = min !== undefined ? Math.max(numValue, min) : numValue;
    const maxValue = max !== undefined ? Math.min(finalValue, max) : finalValue;
    onChange(maxValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleConfirm();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!inputFieldRef.current) return;

    const textContent = inputFieldRef.current.textContent || "";
    // Remove caracteres não numéricos (exceto vírgula, ponto e hífen)
    const cleaned = textContent.replace(/[^\d.,-]/g, "");

    // Atualiza o state
    setInputValue(cleaned);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const cleanedText = text.replace(/[^\d.,-]/g, "");
    document.execCommand("insertText", false, cleanedText);
  };

  const displayValue = formatValue
    ? formatValue(value)
    : value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const textSizeClass = {
    base: "text-base",
    xl: "text-xl",
    "2xl": "text-2xl",
  }[textSize];

  if (isEditing) {
    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {prefix && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-semibold ${textSizeClass} pointer-events-none`}
          >
            {prefix}
          </span>
        )}
        <div
          ref={inputFieldRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          className={`w-full py-2 px-3 bg-white rounded-lg focus:outline-none ${textSizeClass} font-bold min-h-[1em] ${
            prefix ? "pl-10" : ""
          } ${suffix ? "pr-10" : ""} ${
            !inputValue || inputValue === "" ? "text-gray-400" : "text-gray-900"
          }`}
        />
        {(!inputValue || inputValue === "") && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${textSizeClass} ${
              prefix ? "pl-10" : ""
            }`}
          >
            {placeholder}
          </span>
        )}
        {suffix && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold ${textSizeClass} pointer-events-none`}
          >
            {suffix}
          </span>
        )}
      </div>
    );
  }

  const handleClickToEdit = () => {
    if (!disabled) {
      // Limpa o valor numérico antes de entrar no modo de edição
      const plainValue = value
        .toString()
        .replace(",", ".")
        .replace(/[^\d.,-]/g, "");
      initialValueRef.current = plainValue;
      setInputValue(plainValue);
      setIsEditing(true);
    }
  };

  return (
    <div
      onClick={handleClickToEdit}
      className={`w-full py-2 px-3 bg-white rounded-lg ${textSizeClass} font-bold cursor-pointer transition-all ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-50 active:bg-gray-100"
      } text-gray-900`}
    >
      <div className="flex items-center">
        {prefix && <span className="mr-1">{prefix}</span>}
        <span>{displayValue}</span>
        {suffix && <span className="ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
