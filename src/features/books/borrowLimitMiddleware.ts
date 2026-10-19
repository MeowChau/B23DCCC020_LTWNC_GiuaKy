import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../../app/rootReducer';
import { borrowBook, borrowingBlocked } from './booksSlice';
import { MAX_BORROWED_BOOKS } from './types';

export const borrowLimitMiddleware: Middleware<
  Record<never, never>,
  RootState
> =
  ({ getState, dispatch }) =>
  (next) =>
  (action: unknown) => {
    if (borrowBook.match(action)) {
      const { items, borrowedIds } = getState().books;
      const book = items.find((item) => item.id === action.payload);
      // Invalid/duplicate/out-of-stock requests are harmless no-ops in the reducer.
      if (
        book &&
        book.availableCopies > 0 &&
        !borrowedIds.includes(book.id) &&
        borrowedIds.length >= MAX_BORROWED_BOOKS
      ) {
        dispatch(
          borrowingBlocked(
            `Bạn chỉ được mượn tối đa ${MAX_BORROWED_BOOKS} cuốn cùng lúc. Hãy trả bớt sách trước khi mượn tiếp.`,
          ),
        );
        return;
      }
    }
    return next(action);
  };
