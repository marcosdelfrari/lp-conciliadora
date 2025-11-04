"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  id: string;
  label: string;
}

export interface CustomSelectProps {
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  const updatePosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        popoverRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setPosition(null);
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else {
      setPosition(null);
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setPosition(null);
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setPosition(null);
      }
    }
  };

  return (
    <>
      <div
        ref={selectRef}
        onClick={handleToggle}
        className={`w-full py-2 px-3 bg-white rounded-lg text-base font-bold cursor-pointer transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50 active:bg-gray-100"
        } ${selectedOption ? "text-gray-900" : "text-gray-400"}`}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? "" : "italic"}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && position && (
        <div
          ref={popoverRef}
          className="fixed z-50 popover-container"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                    value === option.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {value === option.id && (
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
