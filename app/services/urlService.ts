/**
 * Serviço para gerenciar a lógica de exibição baseada em parâmetros da URL
 */
export class UrlService {
  /**
   * Verifica se deve exibir o SavingsCarousel ou o Quiz baseado no parâmetro da URL
   * @param searchParams - Parâmetros de busca da URL (do useSearchParams do Next.js)
   * @returns true se deve exibir SavingsCarousel, false se deve exibir Quiz
   */
  static deveExibirApp(searchParams: URLSearchParams | null): boolean {
    if (!searchParams) {
      return false;
    }

    const appParam = searchParams.get("app");
    return appParam === "true";
  }

  /**
   * Método alternativo que recebe uma string de query e retorna o resultado
   * @param queryString - String de query da URL (ex: "?app=true")
   * @returns true se deve exibir SavingsCarousel, false se deve exibir Quiz
   */
  static deveExibirAppPorQueryString(queryString: string): boolean {
    if (!queryString) {
      return false;
    }

    const params = new URLSearchParams(queryString.startsWith("?") ? queryString.slice(1) : queryString);
    return params.get("app") === "true";
  }
}

