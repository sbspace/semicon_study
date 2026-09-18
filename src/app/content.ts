import { ContentLoader, type ContentTransport } from '../content/load.js';

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function contentBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalized}content/`;
}

export class BrowserContentTransport implements ContentTransport {
  private readonly baseUrl: string;

  constructor(
    baseUrl = import.meta.env.BASE_URL,
    private readonly fetchJson: FetchLike = (input, init) => fetch(input, init),
  ) {
    this.baseUrl = contentBaseUrl(baseUrl);
  }

  async loadJson(file: string): Promise<unknown> {
    const response = await this.fetchJson(`${this.baseUrl}${file}`, {
      cache: 'no-cache',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Content request failed with HTTP ${response.status}`);
    }
    return response.json();
  }
}

export const browserContentLoader = new ContentLoader(
  new BrowserContentTransport(),
);
