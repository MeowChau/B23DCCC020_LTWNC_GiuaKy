import { fireEvent, render, screen } from '@testing-library/react';
import { makeBook } from '../../../test/fixtures';
import { BookCover } from './BookCover';

describe('BookCover', () => {
  test('keeps the illustrated cover when the image URL is blank', () => {
    const book = makeBook({ coverUrl: '   ' });
    render(<BookCover book={book} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(
      screen.getByText(book.title, { selector: '.cover-title' }),
    ).toBeVisible();
  });

  test('uses the supplied image URL after trimming surrounding whitespace', () => {
    const book = makeBook({
      coverUrl: '  https://example.com/clean-code.jpg  ',
    });
    render(<BookCover book={book} />);
    expect(
      screen.getByRole('img', { name: 'Bìa sách ' + book.title }),
    ).toHaveAttribute('src', 'https://example.com/clean-code.jpg');
  });

  test('falls back to the illustrated cover if the image fails to load', () => {
    const book = makeBook({ coverUrl: '/missing-cover.jpg' });
    render(<BookCover book={book} small />);
    fireEvent.error(
      screen.getByRole('img', { name: 'Bìa sách ' + book.title }),
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(
      screen.getByText(book.title, { selector: '.cover-title' }),
    ).toBeVisible();
  });

  test('tries a replacement URL after the previous image failed', () => {
    const book = makeBook({ coverUrl: '/missing-cover.jpg' });
    const { rerender } = render(<BookCover book={book} />);
    fireEvent.error(screen.getByRole('img'));
    rerender(
      <BookCover book={{ ...book, coverUrl: '/images/clean-code.jpg' }} />,
    );
    expect(
      screen.getByRole('img', { name: 'Bìa sách ' + book.title }),
    ).toHaveAttribute('src', '/images/clean-code.jpg');
  });
});
