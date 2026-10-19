import type { Book, BooksState } from '../features/books/types';

export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 'book-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'CNTT',
    year: 2008,
    availableCopies: 3,
    totalCopies: 4,
    coverTone: 'navy',
    ...overrides,
  };
}

export function makeBooksState(items: Book[] = [makeBook()]): BooksState {
  return {
    items,
    borrowedIds: [],
    status: 'succeeded',
    error: null,
    notice: null,
  };
}
