import { makeBook } from '../../test/fixtures';
import { countCategories, filterBooks } from './booksSelectors';

const books = [
  makeBook(),
  makeBook({
    id: 'economics',
    title: 'Kinh tế học',
    author: 'Paul Samuelson',
    category: 'Kinh tế',
  }),
  makeBook({
    id: 'english',
    title: 'English Grammar',
    author: 'Raymond Murphy',
    category: 'Ngoại ngữ',
  }),
];

test('search matches title or author regardless of case', () => {
  expect(filterBooks(books, 'CLEAN', 'all').map((book) => book.id)).toEqual([
    'book-1',
  ]);
  expect(filterBooks(books, 'rOBerT', 'all').map((book) => book.id)).toEqual([
    'book-1',
  ]);
  expect(filterBooks(books, 'kinh te', 'all').map((book) => book.id)).toEqual([
    'economics',
  ]);
});

test('category and keyword filters are applied together', () => {
  expect(
    filterBooks(books, 'Murphy', 'Ngoại ngữ').map((book) => book.id),
  ).toEqual(['english']);
  expect(filterBooks(books, 'Murphy', 'CNTT')).toEqual([]);
  expect(filterBooks(books, '   ', 'all')).toHaveLength(3);
  expect(countCategories(books)).toEqual({
    CNTT: 1,
    'Kinh tế': 1,
    'Ngoại ngữ': 1,
  });
});
