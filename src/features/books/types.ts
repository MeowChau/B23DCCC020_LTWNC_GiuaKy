export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;
export type Category = (typeof CATEGORIES)[number];
export type CoverTone = 'navy' | 'sand' | 'sage' | 'rust' | 'plum' | 'sky';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  availableCopies: number;
  totalCopies: number;
  coverTone: CoverTone;
}

export type BorrowedBook = Pick<
  Book,
  'id' | 'title' | 'author' | 'category' | 'coverTone'
>;
export type CategoryCounts = Record<Category, number>;
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface LibraryNotice {
  kind: 'success' | 'warning';
  message: string;
}

export interface BooksState {
  items: Book[];
  borrowedIds: Book['id'][];
  status: LoadingStatus;
  error: string | null;
  notice: LibraryNotice | null;
}

export const MAX_BORROWED_BOOKS = 3;
