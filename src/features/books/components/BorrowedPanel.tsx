import { Icon } from '../../../shared/components/Icon';
import { MAX_BORROWED_BOOKS } from '../types';
import type { BorrowedBook } from '../types';
import { BookCover } from './BookCover';

interface BorrowedPanelProps {
  books: readonly BorrowedBook[];
  onReturn: (id: BorrowedBook['id']) => void;
}

export function BorrowedPanel({ books, onReturn }: BorrowedPanelProps) {
  const atLimit = books.length >= MAX_BORROWED_BOOKS;
  return (
    <aside
      className="borrowed-panel"
      id="borrowed"
      aria-labelledby="borrowed-heading"
    >
      <div className="panel-heading">
        <span className="panel-icon">
          <Icon name="bookmark" />
        </span>
        <h2 id="borrowed-heading">Sách đang mượn</h2>
        <span className="loan-count">
          {books.length}
          <small>/{MAX_BORROWED_BOOKS}</small>
        </span>
      </div>
      <div
        className="loan-slots"
        aria-label={
          'Đang mượn ' + books.length + ' trên ' + MAX_BORROWED_BOOKS + ' cuốn'
        }
      >
        {[1, 2, 3].map((slot) => (
          <span key={slot} className={slot <= books.length ? 'filled' : ''} />
        ))}
      </div>
      <p className={'loan-guidance' + (atLimit ? ' limit-reached' : '')}>
        {atLimit
          ? 'Đã đủ 3 cuốn. Trả sách để mở chỗ cho cuốn mới nhé.'
          : 'Bạn có thể mượn thêm ' +
            (MAX_BORROWED_BOOKS - books.length) +
            ' cuốn nữa.'}
      </p>
      {books.length ? (
        <ul className="borrowed-list">
          {books.map((book) => (
            <li key={book.id}>
              <BookCover book={book} small />
              <div className="borrowed-copy">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button
                  type="button"
                  onClick={() => onReturn(book.id)}
                  aria-label={'Trả sách: ' + book.title}
                >
                  <Icon name="return" />
                  Trả sách
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-loans">
          <div className="empty-book">
            <Icon name="book" />
            <span>+</span>
          </div>
          <h3>Kệ sách đang chờ bạn</h3>
          <p>
            Tìm một cuốn yêu thích và nhấn “Mượn”. Sách của bạn sẽ xuất hiện ở
            đây.
          </p>
        </div>
      )}
      <div className="lending-rule">
        <Icon name="info" />
        <p>
          Mỗi sinh viên được mượn tối đa <strong>3 cuốn</strong> cùng lúc. Nhớ
          trả sách khi đọc xong nhé.
        </p>
      </div>
    </aside>
  );
}
