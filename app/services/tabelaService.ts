import {
  TabelaRow,
  Bandeira,
  Modalidade,
  MCCData,
  TaxasPorModalidade,
  TransacaoData,
  DadosEmpresa,
  DadosEmpresaJson,
  BandeiraData,
} from "../types";
import { MCC_TAXAS } from "./data/mccTaxas";
import { CNAE_PARA_MCC } from "./data/cnaeMccMapping";
import { DADOS_EMPRESA_JSON_MOCK } from "./data/dadosEmpresaMock";

/**
 * Normaliza CNAE removendo pontos e hífens para comparação
 * Ex: "56.11-2-03" -> "5611203"
 */
function normalizarCNAE(cnae: string | number): string {
  if (typeof cnae === "number") {
    return cnae.toString();
  }
  return cnae.replace(/[.\-]/g, "");
}

/**
 * Converte CNAE para MCC correspondente
 * @param cnae - CNAE no formato "56.11-2-03" ou número
 * @returns MCC correspondente ou null se não encontrado
 */
function converterCNAEParaMCC(cnae: string | number): number | null {
  // Normalizar CNAE
  const cnaeNormalizado = normalizarCNAE(cnae);
  const cnaeFormatado = typeof cnae === "string" ? cnae : null;

  // Tentar encontrar no mapa (primeiro formato normalizado, depois formatado)
  if (CNAE_PARA_MCC[cnaeNormalizado]) {
    return CNAE_PARA_MCC[cnaeNormalizado];
  }

  if (cnaeFormatado && CNAE_PARA_MCC[cnaeFormatado]) {
    return CNAE_PARA_MCC[cnaeFormatado];
  }

  // Se CNAE for número, tentar usar diretamente como MCC se estiver no formato correto
  if (typeof cnae === "number" && cnae in MCC_TAXAS) {
    return cnae;
  }

  return null;
}

/**
 * Converte string de bandeira para tipo Bandeira
 */
function converterBandeira(bandeiraStr: string): Bandeira | null {
  const bandeirasMap: Record<string, Bandeira> = {
    MASTER: "MASTER",
    VISA: "VISA",
    ELO: "ELO",
    AMEX: "AMEX",
    HIPER: "HIPER",
    // Permitir variações
    MASTERCARD: "MASTER",
    VISA_ELO: "VISA",
  };

  const upper = bandeiraStr.toUpperCase().trim();
  return bandeirasMap[upper] || null;
}

/**
 * Converte string de modalidade para tipo Modalidade
 */
function converterModalidade(modalidadeStr: string): Modalidade | null {
  const upper = modalidadeStr.toUpperCase().trim();

  // Mapeamento de variações possíveis de DÉBITO
  if (upper.includes("DÉBITO") || upper.includes("DEBITO") || upper === "D") {
    return "DEBITO";
  }

  // Mapeamento de variações possíveis de CRÉDITO À VISTA
  if (
    upper.includes("CRÉDITO À VISTA") ||
    upper.includes("CREDITO A VISTA") ||
    upper.includes("CREDITO_A_VISTA") ||
    upper.includes("CRÉDITO A VISTA") ||
    upper.includes("CREDITO À VISTA") ||
    (upper.includes("CRÉDITO") && !upper.match(/\d/)) ||
    upper === "CV"
  ) {
    return "CREDITO_A_VISTA";
  }

  // Mapeamento de variações possíveis de CRÉDITO 2x-6x
  if (
    upper.includes("2X-6X") ||
    upper.includes("2 X 6") ||
    upper.includes("2 A 6") ||
    upper.includes("2-6") ||
    upper.includes("2X A 6X") ||
    (upper.includes("CRÉDITO") && upper.includes("2") && upper.includes("6"))
  ) {
    return "CREDITO_2_A_6";
  }

  // Mapeamento de variações possíveis de CRÉDITO 7x-12x
  if (
    upper.includes("7X-12X") ||
    upper.includes("7 X 12") ||
    upper.includes("7 A 12") ||
    upper.includes("7-12") ||
    upper.includes("7X A 12X") ||
    (upper.includes("CRÉDITO") &&
      upper.includes("7") &&
      (upper.includes("12") || upper.includes("1 2")))
  ) {
    return "CREDITO_7_A_12";
  }

  return null;
}

/**
 * Converte o formato hierárquico JSON para o formato DadosEmpresa
 */
function converterFormatoHierarquico(
  dadosJson: DadosEmpresaJson
): DadosEmpresa {
  const transacoes: TransacaoData[] = [];

  // Converter CNAE para MCC
  const mcc = converterCNAEParaMCC(dadosJson.cnae);

  // Se não conseguir converter, lançar erro ou usar um valor padrão
  if (!mcc) {
    console.warn(
      `CNAE ${dadosJson.cnae} não encontrado no mapeamento para MCC. Verifique se o CNAE está correto.`
    );
    throw new Error(
      `CNAE ${dadosJson.cnae} não possui MCC correspondente cadastrado.`
    );
  }

  // Percorrer todas as adquirentes
  dadosJson.transacao.adquirente.forEach((adquirente) => {
    // Percorrer todas as bandeiras de cada adquirente
    adquirente.bandeiras.forEach((bandeiraData) => {
      const bandeira = converterBandeira(bandeiraData.bandeira);
      const modalidade = converterModalidade(bandeiraData.modalidade);

      // Só adiciona se a conversão for bem-sucedida
      if (bandeira && modalidade) {
        transacoes.push({
          bandeira,
          modalidade,
          taxaAtual: bandeiraData.taxa,
          valor: bandeiraData.valor,
        });
      }
    });
  });

  return {
    mcc, // MCC convertido do CNAE
    transacoes,
  };
}

/**
 * Converte Modalidade para nome exibido na tabela
 */
function formatarNomeModalidade(
  bandeira: Bandeira,
  modalidade: Modalidade
): string {
  // Formatação especial para AMEX que não diferencia entre parcelado 2x-6x e 7x-12x
  if (bandeira === "AMEX" && modalidade !== "DEBITO") {
    if (modalidade === "CREDITO_A_VISTA") {
      return "AMEX CRÉDITO";
    }
    // Para qualquer tipo de parcelado, AMEX usa "AMEX CRÉDITO PARCELADO"
    return "AMEX CRÉDITO PARCELADO";
  }

  // Formatação para outras bandeiras
  const nomesModalidade: Record<Modalidade, string> = {
    DEBITO: bandeira === "ELO" ? "DEBITO" : "DEBITO", // ELO usa DEBITO sem acento
    CREDITO_A_VISTA: bandeira === "ELO" ? "CREDITO" : "CRÉDITO",
    CREDITO_2_A_6: "PARCELADO 2x-6x",
    CREDITO_7_A_12: "PARCELADO 7x-12x",
  };

  return `${bandeira} ${nomesModalidade[modalidade]}`;
}

/**
 * Interface auxiliar para agrupamento de transações
 */
interface TransacaoAgrupada {
  bandeira: Bandeira;
  modalidade: Modalidade;
  valorTotal: number;
  taxaAtualPonderada: number; // Taxa média ponderada pelo valor
  transacoes: TransacaoData[];
}

/**
 * Serviço responsável por fornecer os dados da tabela de economia
 */
export class TabelaService {
  /**
   * Retorna os dados estáticos da tabela de economia
   */
  static getTabelaData(): TabelaRow[] {
    return [
      {
        modalidade: "MASTER DEBITO",
        taxaAtual: 1.2,
        taxaIndicada: 0.81,
        economia: 140.45,
        valor: 145830.72,
      },
      {
        modalidade: "MASTER CRÉDITO",
        taxaAtual: 1.99,
        taxaIndicada: 1.7,
        economia: 20.49,
        valor: 2393.81,
      },
      {
        modalidade: "MASTER PARCELADO 2x-6x",
        taxaAtual: 2.5,
        taxaIndicada: 2.31,
        economia: 29.03,
        valor: 125144.3,
      },
      {
        modalidade: "MASTER PARCELADO 7x-12x",
        taxaAtual: 2.7,
        taxaIndicada: 2.52,
        economia: 1.04,
        valor: 40584.22,
      },
      {
        modalidade: "VISA DEBITO",
        taxaAtual: 1.2,
        taxaIndicada: 0.85,
        economia: 87.25,
        valor: 23456.78,
      },
      {
        modalidade: "VISA CRÉDITO",
        taxaAtual: 2.05,
        taxaIndicada: 2.15,
        economia: 45.32,
        valor: 18976.54,
      },
      {
        modalidade: "VISA PARCELADO 2x-6x",
        taxaAtual: 2.32,
        taxaIndicada: 2.37,
        economia: 128.07,
        valor: 45185.17,
      },
      {
        modalidade: "VISA PARCELADO 7x-12x",
        taxaAtual: 2.6,
        taxaIndicada: 2.78,
        economia: 45.81,
        valor: 17160.45,
      },
      {
        modalidade: "AMEX CRÉDITO",
        taxaAtual: 2.7,
        taxaIndicada: 2.98,
        economia: 56.78,
        valor: 23456.78,
      },
      {
        modalidade: "AMEX CRÉDITO PARCELADO",
        taxaAtual: 3.26,
        taxaIndicada: 2.76,
        economia: 43.21,
        valor: 12345.67,
      },
      {
        modalidade: "ELO CREDITO",
        taxaAtual: 2.1,
        taxaIndicada: 2.85,
        economia: 34.56,
        valor: 18765.43,
      },
      {
        modalidade: "ELO DEBITO",
        taxaAtual: 1.2,
        taxaIndicada: 1.35,
        economia: 78.9,
        valor: 26789.01,
      },
    ];
  }

  /**
   * Calcula a economia total de todas as modalidades
   */
  static calcularEconomiaTotal(): number {
    const dados = this.getTabelaData();
    return dados.reduce((total, row) => total + row.economia, 0);
  }

  /**
   * Filtra modalidades por tipo (débito, crédito, parcelado)
   */
  static filtrarPorTipo(tipo: "debito" | "credito" | "parcelado"): TabelaRow[] {
    const dados = this.getTabelaData();
    return dados.filter((row) =>
      row.modalidade.toLowerCase().includes(tipo.toLowerCase())
    );
  }

  /**
   * Filtra modalidades por bandeira (MASTER, VISA, AMEX, ELO)
   */
  static filtrarPorBandeira(
    bandeira: "MASTER" | "VISA" | "AMEX" | "ELO"
  ): TabelaRow[] {
    const dados = this.getTabelaData();
    return dados.filter((row) => row.modalidade.startsWith(bandeira));
  }

  /**
   * Ordena os dados por economia (decrescente por padrão)
   */
  static ordenarPorEconomia(crescente: boolean = false): TabelaRow[] {
    const dados = this.getTabelaData();
    return dados.sort((a, b) => {
      return crescente ? a.economia - b.economia : b.economia - a.economia;
    });
  }

  /**
   * Busca a taxa indicada para um MCC, bandeira e modalidade específicos
   * @param mcc - Código MCC
   * @param bandeira - Bandeira do cartão
   * @param modalidade - Modalidade da transação
   * @returns Taxa em percentual (ex: 1.82 para 1,82%) ou null se não encontrado
   */
  static buscarTaxaPorMCC(
    mcc: number,
    bandeira: Bandeira,
    modalidade: Modalidade
  ): number | null {
    const mccData = MCC_TAXAS[mcc];
    if (!mccData) {
      return null;
    }

    const taxasModalidade = mccData[modalidade];
    if (!taxasModalidade) {
      return null;
    }

    return taxasModalidade[bandeira] ?? null;
  }

  /**
   * Retorna todas as taxas disponíveis para um MCC específico
   * @param mcc - Código MCC
   * @returns Objeto com todas as taxas por modalidade e bandeira, ou null se MCC não encontrado
   */
  static getTaxasPorMCC(mcc: number): TaxasPorModalidade | null {
    return MCC_TAXAS[mcc] ?? null;
  }

  /**
   * Retorna todos os MCCs disponíveis
   * @returns Array com todos os códigos MCC cadastrados
   */
  static getMCCsDisponiveis(): number[] {
    return Object.keys(MCC_TAXAS).map(Number);
  }

  /**
   * Verifica se um MCC está cadastrado
   * @param mcc - Código MCC
   * @returns true se o MCC existe, false caso contrário
   */
  static existeMCC(mcc: number): boolean {
    return mcc in MCC_TAXAS;
  }

  /**
   * Carrega taxas de MCC a partir de um JSON
   * Útil para quando os dados vierem de uma API externa
   * @param jsonData - Dados JSON no formato MCCData[]
   */
  static carregarTaxasDeJSON(jsonData: MCCData[]): void {
    jsonData.forEach((mccData) => {
      MCC_TAXAS[mccData.mcc] = mccData.taxas;
    });
  }

  /**
   * Processa dados de transações e retorna dados formatados para a tabela
   * Agrupa por bandeira + modalidade, busca taxas indicadas e calcula economia
   * O CNAE/MCC vem uma vez no objeto e é usado para todas as transações
   * @param dados - Dados da empresa no formato hierárquico JSON ou formato simples (ou usa dados mock se não fornecido)
   * @returns Array de TabelaRow pronto para exibição
   */
  static processarTransacoes(
    dados?: DadosEmpresaJson | DadosEmpresa
  ): TabelaRow[] {
    // Se não fornecido, usa mock no formato hierárquico
    if (!dados) {
      dados = DADOS_EMPRESA_JSON_MOCK;
    }

    // Converter formato hierárquico para formato simples se necessário
    let dadosFormatados: DadosEmpresa;
    if ("cnae" in dados && "transacao" in dados) {
      // É formato hierárquico (DadosEmpresaJson)
      dadosFormatados = converterFormatoHierarquico(dados);
    } else {
      // Já está no formato simples (DadosEmpresa)
      dadosFormatados = dados;
    }

    const mcc = dadosFormatados.mcc; // MCC/CNAE único usado para todas as transações
    const transacoes = dadosFormatados.transacoes;

    // Agrupar transações por bandeira + modalidade
    const agrupadas = new Map<string, TransacaoAgrupada>();

    transacoes.forEach((transacao) => {
      // AMEX agrupa todos os parcelados como "CREDITO_2_A_6" para simplificar
      let modalidadeParaAgrupamento = transacao.modalidade;
      if (
        transacao.bandeira === "AMEX" &&
        transacao.modalidade === "CREDITO_7_A_12"
      ) {
        modalidadeParaAgrupamento = "CREDITO_2_A_6";
      }

      const chave = `${transacao.bandeira}_${modalidadeParaAgrupamento}`;

      if (!agrupadas.has(chave)) {
        agrupadas.set(chave, {
          bandeira: transacao.bandeira,
          modalidade: modalidadeParaAgrupamento,
          valorTotal: 0,
          taxaAtualPonderada: 0,
          transacoes: [],
        });
      }

      const grupo = agrupadas.get(chave)!;
      grupo.transacoes.push(transacao);
      grupo.valorTotal += transacao.valor;
    });

    // Calcular taxa média ponderada e buscar taxa indicada para cada grupo
    const resultados: TabelaRow[] = [];

    agrupadas.forEach((grupo) => {
      // Calcular taxa atual média ponderada pelo valor
      let somaPonderada = 0;
      grupo.transacoes.forEach((trans) => {
        somaPonderada += trans.taxaAtual * trans.valor;
      });
      const taxaAtualMedia =
        grupo.valorTotal > 0 ? somaPonderada / grupo.valorTotal : 0;

      // Buscar taxa indicada e calcular média ponderada pelo valor
      // Para múltiplos MCCs, calcular média ponderada das taxas encontradas
      let somaPonderadaIndicada = 0;
      let valorTotalComTaxa = 0;

      grupo.transacoes.forEach((trans) => {
        // Usa o MCC único da empresa para todas as transações
        const taxaIndicada = this.buscarTaxaPorMCC(
          mcc,
          trans.bandeira,
          trans.modalidade
        );
        if (taxaIndicada !== null) {
          somaPonderadaIndicada += taxaIndicada * trans.valor;
          valorTotalComTaxa += trans.valor;
        }
      });

      // Calcular média ponderada das taxas indicadas
      const taxaIndicadaMedia =
        valorTotalComTaxa > 0
          ? somaPonderadaIndicada / valorTotalComTaxa
          : taxaAtualMedia; // Se não encontrar, usar taxa atual

      // Calcular economia total
      // Economia = (Taxa Atual - Taxa Indicada) * Valor / 100
      const diferencaTaxa = taxaAtualMedia - taxaIndicadaMedia;
      const economia = (diferencaTaxa * grupo.valorTotal) / 100;

      resultados.push({
        modalidade: formatarNomeModalidade(grupo.bandeira, grupo.modalidade),
        taxaAtual: taxaAtualMedia,
        taxaIndicada: taxaIndicadaMedia,
        economia: economia,
        valor: grupo.valorTotal,
      });
    });

    // Ordenar por economia (maior economia primeiro)
    return resultados.sort((a, b) => b.economia - a.economia);
  }

  /**
   * Retorna os dados mockados da empresa no formato hierárquico JSON
   */
  static getDadosEmpresaJsonMock(): DadosEmpresaJson {
    return DADOS_EMPRESA_JSON_MOCK;
  }

  /**
   * Converte CNAE para MCC correspondente
   * Método público para uso externo se necessário
   * @param cnae - CNAE no formato "56.11-2-03" ou número
   * @returns MCC correspondente ou null se não encontrado
   */
  static converterCNAEParaMCC(cnae: string | number): number | null {
    return converterCNAEParaMCC(cnae);
  }

  /**
   * Verifica se um CNAE está cadastrado no mapeamento
   * @param cnae - CNAE no formato "56.11-2-03" ou número
   * @returns true se o CNAE possui MCC correspondente, false caso contrário
   */
  static existeCNAE(cnae: string | number): boolean {
    return converterCNAEParaMCC(cnae) !== null;
  }

  /**
   * Processa dados de transações por adquirente
   * Retorna um array de objetos contendo nome do adquirente e dados da tabela
   * @param dados - Dados da empresa no formato hierárquico JSON (ou usa dados mock se não fornecido)
   * @returns Array de objetos com nome do adquirente e dados da tabela
   */
  static processarTransacoesPorAdquirente(
    dados?: DadosEmpresaJson
  ): Array<{ nome: string; data: TabelaRow[] }> {
    // Se não fornecido, usa mock no formato hierárquico
    if (!dados) {
      dados = DADOS_EMPRESA_JSON_MOCK;
    }

    // Converter CNAE para MCC
    const mcc = converterCNAEParaMCC(dados.cnae);
    if (!mcc) {
      console.warn(`CNAE ${dados.cnae} não encontrado no mapeamento para MCC.`);
      return [];
    }

    const resultados: Array<{ nome: string; data: TabelaRow[] }> = [];

    // Processar cada adquirente separadamente
    dados.transacao.adquirente.forEach((adquirente) => {
      // Converter dados do adquirente para formato DadosEmpresa
      const transacoes: TransacaoData[] = [];

      adquirente.bandeiras.forEach((bandeiraData) => {
        const bandeira = converterBandeira(bandeiraData.bandeira);
        const modalidade = converterModalidade(bandeiraData.modalidade);

        if (bandeira && modalidade) {
          transacoes.push({
            bandeira,
            modalidade,
            taxaAtual: bandeiraData.taxa,
            valor: bandeiraData.valor,
          });
        }
      });

      // Agrupar transações por bandeira + modalidade
      const agrupadas = new Map<string, TransacaoAgrupada>();

      transacoes.forEach((transacao) => {
        // AMEX agrupa todos os parcelados como "CREDITO_2_A_6" para simplificar
        let modalidadeParaAgrupamento = transacao.modalidade;
        if (
          transacao.bandeira === "AMEX" &&
          transacao.modalidade === "CREDITO_7_A_12"
        ) {
          modalidadeParaAgrupamento = "CREDITO_2_A_6";
        }

        const chave = `${transacao.bandeira}_${modalidadeParaAgrupamento}`;

        if (!agrupadas.has(chave)) {
          agrupadas.set(chave, {
            bandeira: transacao.bandeira,
            modalidade: modalidadeParaAgrupamento,
            valorTotal: 0,
            taxaAtualPonderada: 0,
            transacoes: [],
          });
        }

        const grupo = agrupadas.get(chave)!;
        grupo.transacoes.push(transacao);
        grupo.valorTotal += transacao.valor;
      });

      // Calcular taxa média ponderada e buscar taxa indicada para cada grupo
      const tabelaRows: TabelaRow[] = [];

      agrupadas.forEach((grupo) => {
        // Calcular taxa atual média ponderada pelo valor
        let somaPonderada = 0;
        grupo.transacoes.forEach((trans) => {
          somaPonderada += trans.taxaAtual * trans.valor;
        });
        const taxaAtualMedia =
          grupo.valorTotal > 0 ? somaPonderada / grupo.valorTotal : 0;

        // Buscar taxa indicada e calcular média ponderada pelo valor
        let somaPonderadaIndicada = 0;
        let valorTotalComTaxa = 0;

        grupo.transacoes.forEach((trans) => {
          const taxaIndicada = this.buscarTaxaPorMCC(
            mcc,
            trans.bandeira,
            trans.modalidade
          );
          if (taxaIndicada !== null) {
            somaPonderadaIndicada += taxaIndicada * trans.valor;
            valorTotalComTaxa += trans.valor;
          }
        });

        // Calcular média ponderada das taxas indicadas
        const taxaIndicadaMedia =
          valorTotalComTaxa > 0
            ? somaPonderadaIndicada / valorTotalComTaxa
            : taxaAtualMedia;

        // Calcular economia total
        const diferencaTaxa = taxaAtualMedia - taxaIndicadaMedia;
        const economia = (diferencaTaxa * grupo.valorTotal) / 100;

        tabelaRows.push({
          modalidade: formatarNomeModalidade(grupo.bandeira, grupo.modalidade),
          taxaAtual: taxaAtualMedia,
          taxaIndicada: taxaIndicadaMedia,
          economia: economia,
          valor: grupo.valorTotal,
        });
      });

      // Ordenar por economia (maior economia primeiro)
      tabelaRows.sort((a, b) => b.economia - a.economia);

      resultados.push({
        nome: adquirente.nome,
        data: tabelaRows,
      });
    });

    return resultados;
  }
}
