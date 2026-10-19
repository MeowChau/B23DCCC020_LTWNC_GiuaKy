import { Link } from 'react-router-dom';
import { BookCard } from '../features/books/components/BookCard';
import { BorrowedPanel } from '../features/books/components/BorrowedPanel';
import { useLibrary } from '../features/books/hooks/useLibrary';
import { MAX_BORROWED_BOOKS } from '../features/books/types';
import { BookFilters } from '../features/filters/BookFilters';
import { useFilterStore } from '../features/filters/filterStore';
import { ErrorState } from '../shared/components/ErrorState';
import { Icon } from '../shared/components/Icon';
import { LoadingState } from '../shared/components/LoadingState';

export default function CatalogPage() {
  const library = useLibrary();
  const resetFilters = useFilterStore((state) => state.reset);
  const loading = library.status === 'idle' || library.status === 'loading';
  return (
    <>
      <section className="library-hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="section-kicker">MỞ SÁCH. MỞ THẾ GIỚI.</p>
          <h1 id="hero-heading">
            Một cuốn sách.
            <br />
            <em>Một góc nhìn mới.</em>
          </h1>
          <p className="hero-description">
            Tìm cuốn sách bạn cần, mượn một chút tri thức
            <br className="desktop-break" /> và mang những ý tưởng mới về cùng
            bạn.
          </p>
          <div className="hero-facts">
            <span>
              <strong>
                {loading && !library.books.length ? '—' : library.books.length}
              </strong>{' '}
              đầu sách
            </span>
            <i />
            <span>3 lĩnh vực chuyên ngành</span>
            <Link to="/stats">
              Xem thống kê
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit" />
          <div className="hero-book-back" />
          <div className="hero-book">
            <span>MINI LIBRARY</span>
            <strong>
              Những
              <br />
              góc nhìn
              <br />
              <em>mới.</em>
            </strong>
            <svg viewBox="0 0 160 100" fill="none">
              <path d="M15 85V45a65 65 0 0 1 130 0v40M35 85V45a45 45 0 0 1 90 0v40M55 85V45a25 25 0 0 1 50 0v40M75 85V45a5 5 0 0 1 10 0v40" />
            </svg>
            <small>ĐỌC · HỌC · KHÁM PHÁ</small>
          </div>
          <span className="art-star star-one">✧</span>
          <span className="art-star star-two">✳</span>
          <span className="hero-art-caption">
            A little reading. A bigger world.
          </span>
        </div>
      </section>
      <a className="mobile-shelf-link" href="#borrowed">
        <Icon name="bookmark" />
        Sách đang mượn
        <strong>
          {library.borrowedIds.length}/{MAX_BORROWED_BOOKS}
        </strong>
        <span>Xem kệ sách</span>
        <Icon name="arrow" />
      </a>
      <div className="library-layout">
        <section className="catalog-section" aria-labelledby="catalog-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">DÀNH CHO NHỮNG TRÍ TÒ MÒ</p>
              <h2 id="catalog-heading">Khám phá thư viện</h2>
            </div>
            <span className="catalog-label">
              <Icon name="book" />
              Danh mục sách
            </span>
          </div>
          <BookFilters
            counts={library.categoryCounts}
            total={library.books.length}
          />
          {library.error && (
            <ErrorState
              message={library.error}
              onRetry={library.onRetry}
              busy={loading}
            />
          )}
          {loading && !library.books.length ? (
            <LoadingState />
          ) : (
            <>
              <div className="results-line" role="status" aria-live="polite">
                <span>
                  Hiển thị <strong>{library.filteredBooks.length}</strong> /{' '}
                  {library.books.length} đầu sách
                </span>
                <span>
                  {library.isSearching
                    ? 'Đang tìm…'
                    : 'Chọn một cuốn, bắt đầu một hành trình.'}
                </span>
              </div>
              {library.filteredBooks.length ? (
                <div className="book-grid" aria-busy={loading}>
                  {library.filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isBorrowed={library.borrowedIds.includes(book.id)}
                      onBorrow={library.onBorrow}
                      onReturn={library.onReturn}
                    />
                  ))}
                </div>
              ) : (
                !library.error && (
                  <div className="empty-results">
                    <Icon name="search" />
                    <h3>Chưa tìm thấy cuốn sách phù hợp</h3>
                    <p>
                      Thử tên tác giả, một từ khoá ngắn hơn hoặc thể loại khác
                      nhé.
                    </p>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={resetFilters}
                    >
                      Xem tất cả sách
                      <Icon name="arrow" />
                    </button>
                  </div>
                )
              )}
            </>
          )}
        </section>
        <div className="loans-column">
          <BorrowedPanel
            books={library.borrowedBooks}
            onReturn={library.onReturn}
          />
        </div>
      </div>
    </>
  );
}
