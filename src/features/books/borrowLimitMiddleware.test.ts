import { createAppStore } from '../../app/store';
import { makeBook, makeBooksState } from '../../test/fixtures';
import { borrowBook, returnBook } from './booksSlice';

function createTestStore() {
  return createAppStore({
    books: makeBooksState(
      ['a', 'b', 'c', 'd'].map((id) => makeBook({ id, title: 'Book ' + id })),
    ),
  });
}

describe('borrowLimitMiddleware with a real Redux store', () => {
  test('allows three loans and blocks the fourth before the reducer', () => {
    const store = createTestStore();
    for (const id of ['a', 'b', 'c']) store.dispatch(borrowBook(id));
    const before = store
      .getState()
      .books.items.find((book) => book.id === 'd')?.availableCopies;
    store.dispatch(borrowBook('d'));
    expect(store.getState().books.borrowedIds).toEqual(['a', 'b', 'c']);
    expect(
      store.getState().books.items.find((book) => book.id === 'd')
        ?.availableCopies,
    ).toBe(before);
    expect(store.getState().books.notice?.kind).toBe('warning');
    expect(store.getState().books.notice?.message).toContain('tối đa 3 cuốn');
  });
  test('returning a loan makes room for another book', () => {
    const store = createTestStore();
    for (const id of ['a', 'b', 'c']) store.dispatch(borrowBook(id));
    store.dispatch(returnBook('a'));
    store.dispatch(borrowBook('d'));
    expect(store.getState().books.borrowedIds).toEqual(['b', 'c', 'd']);
    expect(
      store.getState().books.items.find((book) => book.id === 'a')
        ?.availableCopies,
    ).toBe(3);
    expect(
      store.getState().books.items.find((book) => book.id === 'd')
        ?.availableCopies,
    ).toBe(2);
  });
  test('a duplicate action at the limit does not consume another slot', () => {
    const store = createTestStore();
    for (const id of ['a', 'b', 'c']) store.dispatch(borrowBook(id));
    store.dispatch(borrowBook('a'));
    expect(store.getState().books.borrowedIds).toHaveLength(3);
    expect(
      store.getState().books.items.find((book) => book.id === 'a')
        ?.availableCopies,
    ).toBe(2);
  });
});
