import type { RootState } from '../../app/rootReducer';
import type { Book, CategoryCounts } from './types';
import type { CategoryFilter } from '../filters/filterStore';

export const selectBooks = (state: RootState) => state.books.items;
export const selectBorrowedIds = (state: RootState) => state.books.borrowedIds;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectNotice = (state: RootState) => state.books.notice;

export function countCategories(books: readonly Book[]): CategoryCounts {
  const counts: CategoryCounts = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
  for (const book of books) counts[book.category] += 1;
  return counts;
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('vi-VN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function filterBooks(
  books: readonly Book[],
  search: string,
  category: CategoryFilter,
): Book[] {
  const query = normalizeSearch(search);
  return books.filter(
    (book) =>
      (category === 'all' || book.category === category) &&
      (!query ||
        normalizeSearch(book.title).includes(query) ||
        normalizeSearch(book.author).includes(query)),
  );
}
