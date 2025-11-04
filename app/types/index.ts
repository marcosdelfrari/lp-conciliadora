export interface TabelaRow {
  modalidade: string;
  taxaAtual: number;
  taxaIndicada: number;
  economia: number;
  valor: number;
}

export type Bandeira = "MASTER" | "VISA" | "ELO" | "AMEX" | "HIPER";

export type Modalidade = "DEBITO" | "CREDITO_A_VISTA" | "CREDITO_2_A_6" | "CREDITO_7_A_12";

export interface TaxasPorBandeira {
  MASTER?: number;
  VISA?: number;
  ELO?: number;
  AMEX?: number;
  HIPER?: number;
}

export interface TaxasPorModalidade {
  DEBITO: TaxasPorBandeira;
  CREDITO_A_VISTA: TaxasPorBandeira;
  CREDITO_2_A_6: TaxasPorBandeira;
  CREDITO_7_A_12: TaxasPorBandeira;
}

export interface MCCData {
  mcc: number;
  taxas: TaxasPorModalidade;
}

/**
 * Interface para dados de transação recebidos via JSON
 * O MCC não vem aqui porque é único por empresa
 */
export interface TransacaoData {
  bandeira: Bandeira;
  modalidade: Modalidade;
  taxaAtual: number; // Taxa atual em percentual (ex: 1.82 para 1,82%)
  valor: number; // Valor da transação em R$
}

/**
 * Interface para dados completos de uma empresa
 * O MCC vem uma vez e é usado para todas as transações
 */
export interface DadosEmpresa {
  mcc: number; // MCC único da empresa
  transacoes: TransacaoData[]; // Array de transações da empresa
}

/**
 * Interface para dados de bandeira no novo formato JSON hierárquico
 */
export interface BandeiraData {
  bandeira: string; // Nome da bandeira (será convertido para tipo Bandeira)
  modalidade: string; // Modalidade de pagamento (será convertido para tipo Modalidade)
  taxa: number; // Taxa atual
  valor: number; // Valor total das transações
}

/**
 * Interface para dados de adquirente no novo formato JSON hierárquico
 */
export interface AdquirenteData {
  nome: string; // Nome da adquirente
  bandeiras: BandeiraData[]; // Array de bandeiras
}

/**
 * Interface para dados de transação no novo formato JSON hierárquico
 */
export interface TransacaoHierarquica {
  adquirente: AdquirenteData[]; // Array de adquirentes
}

/**
 * Interface completa do novo formato JSON
 */
export interface DadosEmpresaJson {
  cnae: string | number; // CNAE da empresa (pode vir como "56.11-2-03" ou número) - será convertido para MCC
  transacao: TransacaoHierarquica; // Objeto de transação com adquirentes
}

