import type { Book } from '../features/books/types';
import type { ApiResult } from '../shared/types/api';
import { BOOKS } from './booksData';

export const API_DELAY_MS = 500;

export function getBooks(shouldFail = false): Promise<ApiResult<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Chưa thể kết nối với thư viện. Bạn thử tải lại nhé.',
        });
        return;
      }
      // Give each request its own objects; Redux must never mutate the API fixtures.
      resolve({ ok: true, data: BOOKS.map((book) => ({ ...book })) });
    }, API_DELAY_MS);
  });
}
