import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getBooks } from '../../api/booksApi';
import { isApiSuccess } from '../../shared/types/api';
import type { Book, BooksState } from './types';

export const initialBooksState: BooksState = {
  items: [],
  borrowedIds: [],
  status: 'idle',
  error: null,
  notice: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { state: { books: BooksState }; rejectValue: string }
>(
  'books/fetchAll',
  async (shouldFail = false, { rejectWithValue }) => {
    try {
      const result = await getBooks(shouldFail);
      if (!isApiSuccess(result)) return rejectWithValue(result.error);
      return result.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Không tải được danh sách sách.',
      );
    }
  },
  { condition: (_, { getState }) => getState().books.status !== 'loading' },
);

const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    borrowBook(state, action: PayloadAction<Book['id']>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (
        !book ||
        book.availableCopies <= 0 ||
        state.borrowedIds.includes(book.id)
      )
        return;
      // The lending limit is enforced by borrowLimitMiddleware before this reducer runs.
      book.availableCopies -= 1;
      state.borrowedIds.push(book.id);
      state.notice = {
        kind: 'success',
        message: `Đã mượn “${book.title}”. Chúc bạn đọc sách vui vẻ!`,
      };
    },
    returnBook(state, action: PayloadAction<Book['id']>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (!book || !state.borrowedIds.includes(book.id)) return;
      book.availableCopies += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== book.id);
      state.notice = {
        kind: 'success',
        message: `Đã trả “${book.title}”. Cảm ơn bạn!`,
      };
    },
    borrowingBlocked(state, action: PayloadAction<string>) {
      state.notice = { kind: 'warning', message: action.payload };
    },
    dismissNotice(state) {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Preserve current loans when refreshing; the API represents the original inventory.
        state.borrowedIds = state.borrowedIds.filter((id) =>
          action.payload.some((book) => book.id === id),
        );
        state.items = action.payload.map((book) => ({
          ...book,
          availableCopies: Math.max(
            0,
            book.availableCopies - Number(state.borrowedIds.includes(book.id)),
          ),
        }));
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Không tải được sách.';
      });
  },
});

export const { borrowBook, returnBook, borrowingBlocked, dismissNotice } =
  booksSlice.actions;
export default booksSlice.reducer;
