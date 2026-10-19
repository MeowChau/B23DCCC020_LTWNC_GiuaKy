import { getBooks } from '../../api/booksApi';
import { createAppStore } from '../../app/store';
import { makeBook } from '../../test/fixtures';
import { fetchBooks } from './booksSlice';

jest.mock('../../api/booksApi');
const mockGetBooks = jest.mocked(getBooks);

test('async thunk moves through pending to fulfilled', async () => {
  mockGetBooks.mockResolvedValue({ ok: true, data: [makeBook()] });
  const store = createAppStore();
  const request = store.dispatch(fetchBooks(false));
  expect(store.getState().books.status).toBe('loading');
  await request;
  expect(store.getState().books.status).toBe('succeeded');
  expect(store.getState().books.items).toHaveLength(1);
});

test('async thunk rejects a typed API failure', async () => {
  mockGetBooks.mockResolvedValue({ ok: false, error: 'Library offline' });
  const store = createAppStore();
  await store.dispatch(fetchBooks(true));
  expect(store.getState().books.status).toBe('failed');
  expect(store.getState().books.error).toBe('Library offline');
});

test('async thunk handles an unexpected thrown error', async () => {
  mockGetBooks.mockRejectedValue(new Error('Unexpected failure'));
  const store = createAppStore();
  await store.dispatch(fetchBooks(false));
  expect(store.getState().books.status).toBe('failed');
  expect(store.getState().books.error).toBe('Unexpected failure');
});
