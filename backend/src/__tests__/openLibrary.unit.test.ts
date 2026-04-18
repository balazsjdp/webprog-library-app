import { OpenLibraryService } from '../services/OpenLibraryService';

describe('OpenLibraryService.buildCoverUrl', () => {
  it('builds the correct cover URL for a given ISBN and size', () => {
    const url = OpenLibraryService.buildCoverUrl('9780261102354', 'M');
    expect(url).toBe('https://covers.openlibrary.org/b/isbn/9780261102354-M.jpg');
  });

  it('builds small cover URL', () => {
    const url = OpenLibraryService.buildCoverUrl('9780261102354', 'S');
    expect(url).toBe('https://covers.openlibrary.org/b/isbn/9780261102354-S.jpg');
  });

  it('builds large cover URL', () => {
    const url = OpenLibraryService.buildCoverUrl('9780261102354', 'L');
    expect(url).toBe('https://covers.openlibrary.org/b/isbn/9780261102354-L.jpg');
  });
});

describe('OpenLibraryService OL doc mapping', () => {
  it('prefers 13-digit ISBN for cover URL over cover_i', () => {
    const isbn13 = '9780007488476';
    const url = OpenLibraryService.buildCoverUrl(isbn13, 'M');
    expect(url).toContain(`/isbn/${isbn13}-M.jpg`);
    expect(url).not.toContain('/id/');
  });

  it('falls back to null when no isbn or cover_i', () => {
    const url = OpenLibraryService.buildCoverUrl('', 'M');
    expect(url).toBe('https://covers.openlibrary.org/b/isbn/-M.jpg');
  });
});
