"use client";

import { TabelaRow } from "../types";

interface SavingsTableProps {
  data: TabelaRow[];
  nome?: string;
}

export default function SavingsTable({ data, nome }: SavingsTableProps) {
  const totalEconomia = data.reduce((sum, item) => sum + item.economia, 0);

  return (
    <div className="space-y-4 p-4 lg:p-5">
      {/* Alerta de Economia */}
      <div className="relative rounded-lg p-5 lg:p-6 bg-[#c3d800]">
        <p className="text-sm lg:text-base font-semibold mb-2 text-[#103239]">
          Economize
        </p>
        <p className="text-3xl lg:text-4xl font-black mb-1 text-[#103239]">
          R${" "}
          {totalEconomia.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        {/* Título do adquirente */}
        {nome && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm text-[#103239] opacity-80 mb-1">
              Taxas da sua adquirente:
            </p>
            <h3 className="text-lg font-bold text-[#103239]">{nome}</h3>
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-[#103239]">
                  Modalidade
                </th>
                <th className="text-right py-2 px-3 font-semibold text-[#103239]">
                  Taxa Atual
                </th>
                <th className="text-right py-2 px-3 font-semibold text-[#103239]">
                  Taxa Indicada
                </th>
                <th className="text-right py-2 px-3 font-semibold cursor-pointer text-[#103239]">
                  Economia ↓
                </th>
                <th className="text-right py-2 px-3 font-semibold text-[#103239] opacity-65">
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
                  <td className="py-2 px-3 text-[#103239]">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
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
                      {row.modalidade}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-[#103239]">
                    {row.taxaAtual.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                  <td className="py-2 px-3 text-right text-[#103239]">
                    {row.taxaIndicada.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                  <td className="py-2 px-3 text-right text-[#103239]">
                    R${" "}
                    {row.economia.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 text-right text-[#103239] opacity-65">
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
