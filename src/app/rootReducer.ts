import { combineReducers } from '@reduxjs/toolkit';
import books from '../features/books/booksSlice';

export const rootReducer = combineReducers({ books });
export type RootState = ReturnType<typeof rootReducer>;
