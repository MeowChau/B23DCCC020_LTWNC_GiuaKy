import type { BorrowedBook } from '../types';

export function BookCover({
  book,
  small = false,
}: {
  book: BorrowedBook;
  small?: boolean;
}) {
  return (
    <div
      className={
        'book-cover tone-' + book.coverTone + (small ? ' book-cover-small' : '')
      }
      aria-hidden="true"
    >
      <span className="cover-imprint">MINI LIBRARY</span>
      <strong className="cover-title">{book.title}</strong>
      <svg className="cover-art" viewBox="0 0 120 100" fill="none">
        {book.category === 'CNTT' ? (
          <>
            <path d="M15 15h90v70H15zM45 15v70m30-70v70M15 38h90M15 62h90" />
            <circle cx="60" cy="50" r="29" />
          </>
        ) : book.category === 'Kinh tế' ? (
          <>
            <circle cx="60" cy="50" r="38" />
            <circle cx="60" cy="50" r="24" />
            <circle cx="60" cy="50" r="10" />
            <path d="M10 50h100M60 4v92" />
          </>
        ) : (
          <>
            <path d="M22 86V49a38 38 0 0 1 76 0v37M35 86V49a25 25 0 0 1 50 0v37M48 86V49a12 12 0 0 1 24 0v37M15 86h90" />
          </>
        )}
      </svg>
      <span className="cover-author">{book.author}</span>
    </div>
  );
}
