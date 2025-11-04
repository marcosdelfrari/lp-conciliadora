import { DadosEmpresaJson } from "../../types";

/**
 * JSON Mockado com dados da empresa no novo formato hierárquico
 * Simula dados que viriam de uma API externa
 * O CNAE vem uma vez e todas as transações usam esse mesmo CNAE (equivalente ao MCC)
 */
export const DADOS_EMPRESA_JSON_MOCK: DadosEmpresaJson = {
  cnae: "56.11-2-03", // CNAE único da empresa (será convertido para MCC 5813)
  transacao: {
    adquirente: [
      {
        nome: "Cielo",
        bandeiras: [
          {
            bandeira: "MASTER",
            modalidade: "DÉBITO",
            taxa: 1.2,
            valor: 145830.72,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO À VISTA",
            taxa: 1.99,
            valor: 2393.81,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.5,
            valor: 125144.3,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO 7x-12x",
            taxa: 2.7,
            valor: 40584.22,
          },
          {
            bandeira: "VISA",
            modalidade: "DÉBITO",
            taxa: 1.2,
            valor: 23456.78,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.05,
            valor: 18976.54,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.32,
            valor: 45185.17,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 7x-12x",
            taxa: 2.6,
            valor: 17160.45,
          },
          {
            bandeira: "AMEX",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.7,
            valor: 23456.78,
          },
          {
            bandeira: "AMEX",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 3.26,
            valor: 12345.67,
          },
          {
            bandeira: "ELO",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.1,
            valor: 18765.43,
          },
        ],
      },
      {
        nome: "Rede",
        bandeiras: [
          {
            bandeira: "MASTER",
            modalidade: "DÉBITO",
            taxa: 1.25,
            valor: 35000.0,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.05,
            valor: 28000.0,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.55,
            valor: 65000.0,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO 7x-12x",
            taxa: 2.75,
            valor: 22000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "DÉBITO",
            taxa: 1.25,
            valor: 42000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.1,
            valor: 31000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.38,
            valor: 58000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 7x-12x",
            taxa: 2.65,
            valor: 25000.0,
          },
          {
            bandeira: "ELO",
            modalidade: "DÉBITO",
            taxa: 1.25,
            valor: 18000.0,
          },
          {
            bandeira: "ELO",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.15,
            valor: 15000.0,
          },
        ],
      },
      {
        nome: "Adyen",
        bandeiras: [
          {
            bandeira: "MASTER",
            modalidade: "DÉBITO",
            taxa: 1.15,
            valor: 42000.0,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO À VISTA",
            taxa: 1.95,
            valor: 32000.0,
          },
          {
            bandeira: "MASTER",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.45,
            valor: 72000.0,
          },

          {
            bandeira: "VISA",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.0,
            valor: 35000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 2.28,
            valor: 65000.0,
          },
          {
            bandeira: "VISA",
            modalidade: "CRÉDITO 7x-12x",
            taxa: 2.55,
            valor: 30000.0,
          },
          {
            bandeira: "AMEX",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.6,
            valor: 18000.0,
          },
          {
            bandeira: "AMEX",
            modalidade: "CRÉDITO 2x-6x",
            taxa: 3.15,
            valor: 15000.0,
          },
          {
            bandeira: "ELO",
            modalidade: "DÉBITO",
            taxa: 1.2,
            valor: 20000.0,
          },
          {
            bandeira: "ELO",
            modalidade: "CRÉDITO À VISTA",
            taxa: 2.05,
            valor: 17000.0,
          },
        ],
      },
    ],
  },
};
