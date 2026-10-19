import { memo } from 'react';
import { Icon } from '../../../shared/components/Icon';
import type { Book } from '../types';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Readonly<Book>;
  isBorrowed: boolean;
  onBorrow: (id: Book['id']) => void;
  onReturn: (id: Book['id']) => void;
}

export const BookCard = memo(function BookCard({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
}: BookCardProps) {
  const outOfStock = book.availableCopies === 0;
  return (
    <article
      className={'book-card' + (isBorrowed ? ' is-borrowed' : '')}
      aria-label={book.title}
    >
      <div className={'book-stage stage-' + book.coverTone}>
        <BookCover book={book} />
        {isBorrowed && (
          <span className="borrowed-badge">
            <Icon name="check" />
            Đang mượn
          </span>
        )}
      </div>
      <div className="book-content">
        <div className="book-meta">
          <span>{book.category}</span>
          <span>{book.year}</span>
        </div>
        <h3 title={book.title}>{book.title}</h3>
        <p className="book-author" title={book.author}>
          {book.author}
        </p>
        <div className="book-card-bottom">
          <span className={'stock-label' + (outOfStock ? ' out-of-stock' : '')}>
            <i />
            {outOfStock ? 'Hết bản' : 'Còn ' + book.availableCopies + ' bản'}
          </span>
          {isBorrowed ? (
            <button
              className="book-action return-action"
              type="button"
              onClick={() => onReturn(book.id)}
            >
              <Icon name="return" />
              Trả
            </button>
          ) : (
            <button
              className="book-action"
              type="button"
              disabled={outOfStock}
              onClick={() => onBorrow(book.id)}
              title={
                outOfStock
                  ? 'Sách đã hết bản có thể mượn'
                  : 'Mượn ' + book.title
              }
            >
              Mượn
              <Icon name="arrow" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
});
