import reducer, {
  borrowBook,
  borrowingBlocked,
  dismissNotice,
  fetchBooks,
  initialBooksState,
  returnBook,
} from './booksSlice';
import { makeBook, makeBooksState } from '../../test/fixtures';
import type { BooksState } from './types';

describe('booksSlice reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialBooksState);
  });
  test('pending sets loading and clears the last error', () => {
    const state: BooksState = {
      ...makeBooksState(),
      status: 'failed',
      error: 'Old error',
    };
    const next = reducer(state, fetchBooks.pending('request-1', false));
    expect(next.status).toBe('loading');
    expect(next.error).toBeNull();
  });
  test('fulfilled stores books and succeeds', () => {
    const books = [makeBook()];
    const next = reducer(
      initialBooksState,
      fetchBooks.fulfilled(books, 'request-1', false),
    );
    expect(next.status).toBe('succeeded');
    expect(next.items).toEqual(books);
  });
  test('rejected stores the API error without deleting current books', () => {
    const state = makeBooksState();
    const next = reducer(
      state,
      fetchBooks.rejected(null, 'request-1', true, 'API unavailable'),
    );
    expect(next.status).toBe('failed');
    expect(next.error).toBe('API unavailable');
    expect(next.items).toEqual(state.items);
  });
  test('borrowing decreases copies, adds the id and preserves previous state', () => {
    const state = makeBooksState();
    const next = reducer(state, borrowBook('book-1'));
    expect(next.items[0]?.availableCopies).toBe(2);
    expect(next.borrowedIds).toEqual(['book-1']);
    expect(state.items[0]?.availableCopies).toBe(3);
    expect(state.borrowedIds).toEqual([]);
  });
  test('out-of-stock books cannot be borrowed', () => {
    const state = makeBooksState([makeBook({ availableCopies: 0 })]);
    expect(reducer(state, borrowBook('book-1'))).toEqual(state);
  });
  test('duplicate and unknown requests do not change inventory', () => {
    const state = reducer(makeBooksState(), borrowBook('book-1'));
    expect(reducer(state, borrowBook('book-1'))).toEqual(state);
    expect(reducer(state, borrowBook('missing'))).toEqual(state);
  });
  test('returning restores one copy and removes the loan', () => {
    const state = reducer(makeBooksState(), borrowBook('book-1'));
    const next = reducer(state, returnBook('book-1'));
    expect(next.items[0]?.availableCopies).toBe(3);
    expect(next.borrowedIds).toEqual([]);
  });
  test('returning twice or returning an unborrowed book does not create extra copies', () => {
    const state = makeBooksState();
    expect(reducer(state, returnBook('book-1'))).toEqual(state);
    expect(reducer(state, returnBook('missing'))).toEqual(state);
  });
  test('refreshing keeps loans and deducts each loan exactly once', () => {
    const borrowed = reducer(makeBooksState(), borrowBook('book-1'));
    const first = reducer(
      borrowed,
      fetchBooks.fulfilled([makeBook()], 'refresh-1', false),
    );
    const second = reducer(
      first,
      fetchBooks.fulfilled([makeBook()], 'refresh-2', false),
    );
    expect(second.borrowedIds).toEqual(['book-1']);
    expect(second.items[0]?.availableCopies).toBe(2);
  });
  test('warning notices can be dismissed', () => {
    const state = reducer(
      makeBooksState(),
      borrowingBlocked('Maximum reached'),
    );
    expect(state.notice).toEqual({
      kind: 'warning',
      message: 'Maximum reached',
    });
    expect(reducer(state, dismissNotice()).notice).toBeNull();
  });
});
