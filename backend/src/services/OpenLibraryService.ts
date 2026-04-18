import axios from 'axios';
import { CacheService, hashParams } from './CacheService';

const OL_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org';

const http = axios.create({
  timeout: 8000,
  headers: { 'User-Agent': 'KonyvtarApp/1.0 (university-project)' },
});

export interface OLSearchResult {
  olWorkId: string;
  title: string;
  author: string;
  isbn: string | null;
  publishedYear: number | null;
  coverUrl: string | null;
}

export interface OLWorkDetail {
  description: string | null;
}

type OLDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export const OpenLibraryService = {
  async search(query: string): Promise<OLSearchResult[]> {
    const cacheKey = `ol:search:${hashParams({ query })}`;
    const cached = await CacheService.get<OLSearchResult[]>(cacheKey);
    if (cached) return cached;

    const response = await http.get<{ docs: OLDoc[] }>(`${OL_BASE}/search.json`, {
      params: {
        q: query,
        fields: 'key,title,author_name,isbn,first_publish_year,cover_i',
        limit: 10,
      },
    });

    const results: OLSearchResult[] = (response.data.docs ?? []).map((doc) => {
      const olWorkId = (doc.key ?? '').replace('/works/', '');
      const isbn = doc.isbn?.find((i) => i.length === 13) ?? null;
      return {
        olWorkId,
        title: doc.title ?? '',
        author: doc.author_name?.[0] ?? '',
        isbn,
        publishedYear: doc.first_publish_year ?? null,
        coverUrl: isbn
          ? OpenLibraryService.buildCoverUrl(isbn, 'M')
          : doc.cover_i
            ? `${COVERS_BASE}/b/id/${doc.cover_i}-M.jpg`
            : null,
      };
    });

    await CacheService.set(cacheKey, results, 3600);
    return results;
  },

  async getWorkDetails(workId: string): Promise<OLWorkDetail> {
    const response = await http.get<{ description?: string | { value: string } }>(
      `${OL_BASE}/works/${workId}.json`
    );
    const desc = response.data.description;
    return {
      description: typeof desc === 'string' ? desc : (desc?.value ?? null),
    };
  },

  buildCoverUrl(isbn: string, size: 'S' | 'M' | 'L'): string {
    return `${COVERS_BASE}/b/isbn/${isbn}-${size}.jpg`;
  },
};
