"use client";

import { TabelaRow } from "../types";

interface SavingsTableProps {
  data: TabelaRow[];
  nome?: string;
}

export default function SavingsTable({ data, nome }: SavingsTableProps) {
  const totalEconomia = data.reduce((sum, item) => sum + item.economia, 0);

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-5">
      {/* Alerta de Economia */}
      <div className="relative rounded-lg p-3 sm:p-4 bg-[#c3d800] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="w-full sm:w-auto">
          <p className="text-xs sm:text-sm lg:text-base font-semibold mb-1 sm:mb-2 text-[#103239]">
            Economize
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#103239]">
              R${" "}
              {totalEconomia.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {nome && (
              <div className="">
                <p className="text-xs sm:text-sm text-[#103239] opacity-80">
                  Em relação as taxas da <b className="text-black">{nome}</b>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-[10px] sm:text-xs min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-2 sm:px-3 font-semibold text-[#103239] whitespace-nowrap">
                  Modalidade
                </th>
                <th className="text-right py-2 px-2 sm:px-3 font-semibold text-[#103239] whitespace-nowrap">
                  Taxa Atual
                </th>
                <th className="text-right py-2 px-2 sm:px-3 font-semibold text-[#103239] whitespace-nowrap">
                  Taxa Indicada
                </th>
                <th className="text-right py-2 px-2 sm:px-3 font-semibold cursor-pointer text-[#103239] whitespace-nowrap">
                  Economia ↓
                </th>
                <th className="text-right py-2 px-2 sm:px-3 font-semibold text-[#103239] opacity-65 whitespace-nowrap">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index === 0
                      ? "border-l-4 border-l-[#c3d800] bg-white"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }`}
                >
                  <td className="py-2 px-2 sm:px-3 text-[#103239]">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
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
                      <span className="whitespace-nowrap">{row.modalidade}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-right text-[#103239] whitespace-nowrap">
                    {row.taxaAtual.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-right text-[#103239] whitespace-nowrap">
                    {row.taxaIndicada.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-right text-[#103239] whitespace-nowrap">
                    R${" "}
                    {row.economia.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-right text-[#103239] opacity-65 whitespace-nowrap">
                    R${" "}
                    {row.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
