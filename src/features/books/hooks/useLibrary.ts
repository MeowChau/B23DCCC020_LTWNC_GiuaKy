import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useFilterStore } from '../../filters/filterStore';
import { borrowBook, fetchBooks, returnBook } from '../booksSlice';
import {
  countCategories,
  filterBooks,
  selectBooks,
  selectBooksError,
  selectBooksStatus,
  selectBorrowedIds,
} from '../booksSelectors';
import type { Book } from '../types';

export function useLibrary() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const search = useFilterStore((state) => state.search);
  const category = useFilterStore((state) => state.category);
  const debouncedSearch = useDebounce(search, 300);

  const filteredBooks = useMemo(
    () => filterBooks(books, debouncedSearch, category),
    [books, debouncedSearch, category],
  );
  const categoryCounts = useMemo(() => countCategories(books), [books]);
  const borrowedBooks = useMemo(
    () =>
      borrowedIds
        .map((id) => books.find((book) => book.id === id))
        .filter((book): book is Book => book !== undefined),
    [books, borrowedIds],
  );
  const onBorrow = useCallback(
    (id: Book['id']) => {
      dispatch(borrowBook(id));
    },
    [dispatch],
  );
  const onReturn = useCallback(
    (id: Book['id']) => {
      dispatch(returnBook(id));
    },
    [dispatch],
  );
  const onRetry = useCallback(() => {
    void dispatch(fetchBooks(false));
  }, [dispatch]);

  return {
    books,
    borrowedIds,
    borrowedBooks,
    filteredBooks,
    categoryCounts,
    status,
    error,
    onBorrow,
    onReturn,
    onRetry,
    isSearching: search !== debouncedSearch,
  };
}
