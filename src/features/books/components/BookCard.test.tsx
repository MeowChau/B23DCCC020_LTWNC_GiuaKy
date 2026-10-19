import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeBook } from '../../../test/fixtures';
import { BookCard } from './BookCard';

describe('BookCard', () => {
  test('displays the title, author, category, year and available copies', () => {
    const book = makeBook();
    render(
      <BookCard
        book={book}
        isBorrowed={false}
        onBorrow={jest.fn()}
        onReturn={jest.fn()}
      />,
    );
    expect(screen.getByRole('heading', { name: book.title })).toBeVisible();
    expect(screen.getByText(book.author, { selector: 'p' })).toBeVisible();
    expect(screen.getByText('CNTT')).toBeVisible();
    expect(screen.getByText('2008')).toBeVisible();
    expect(screen.getByText('Còn 3 bản')).toBeVisible();
  });
  test('clicking Borrow calls the handler once with the correct book id', async () => {
    const user = userEvent.setup();
    const onBorrow = jest.fn();
    render(
      <BookCard
        book={makeBook()}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={jest.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Mượn' }));
    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('book-1');
  });
  test('Borrow is disabled when no copy remains', async () => {
    const user = userEvent.setup();
    const onBorrow = jest.fn();
    render(
      <BookCard
        book={makeBook({ availableCopies: 0 })}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={jest.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: 'Mượn' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onBorrow).not.toHaveBeenCalled();
    expect(screen.getByText('Hết bản')).toBeVisible();
  });
  test('borrowed books show an enabled Return button even when no other copy remains', async () => {
    const user = userEvent.setup();
    const onReturn = jest.fn();
    render(
      <BookCard
        book={makeBook({ availableCopies: 0 })}
        isBorrowed
        onBorrow={jest.fn()}
        onReturn={onReturn}
      />,
    );
    const button = screen.getByRole('button', { name: 'Trả' });
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onReturn).toHaveBeenCalledWith('book-1');
  });
});
