import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  countCategories,
  selectBooks,
  selectBooksError,
  selectBooksStatus,
  selectBorrowedIds,
} from '../features/books/booksSelectors';
import { fetchBooks } from '../features/books/booksSlice';
import { CATEGORIES, MAX_BORROWED_BOOKS } from '../features/books/types';
import { ErrorState } from '../shared/components/ErrorState';
import { Icon } from '../shared/components/Icon';
import { LoadingState } from '../shared/components/LoadingState';

export default function StatsPage() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const categories = useMemo(() => countCategories(books), [books]);
  const availableCopies = useMemo(
    () => books.reduce((total, book) => total + book.availableCopies, 0),
    [books],
  );
  const categoryRows = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        titles: categories[category],
        available: books
          .filter((book) => book.category === category)
          .reduce((sum, book) => sum + book.availableCopies, 0),
        borrowed: books.filter(
          (book) => book.category === category && borrowedIds.includes(book.id),
        ).length,
      })),
    [books, categories, borrowedIds],
  );
  const retry = useCallback(() => {
    void dispatch(fetchBooks(false));
  }, [dispatch]);
  const loading = status === 'idle' || status === 'loading';

  return (
    <section className="stats-page" aria-labelledby="stats-heading">
      <Link className="back-link" to="/">
        <Icon name="return" />
        Về danh mục sách
      </Link>
      <div className="stats-heading">
        <div>
          <p className="section-kicker">THƯ VIỆN QUA NHỮNG CON SỐ</p>
          <h1 id="stats-heading">Một góc nhìn tổng quan.</h1>
          <p>Hiểu kho sách của khoa và hành trình đọc của bạn.</p>
        </div>
        <span className="stats-heading-icon">
          <Icon name="chart" />
        </span>
      </div>
      {error && <ErrorState message={error} onRetry={retry} busy={loading} />}
      {loading && !books.length ? (
        <LoadingState compact />
      ) : (
        <>
          <div className="stats-summary">
            <article>
              <span>
                <Icon name="book" />
                Tổng đầu sách
              </span>
              <strong data-testid="total-titles">{books.length}</strong>
              <p>Trong danh mục thư viện</p>
            </article>
            <article>
              <span>
                <Icon name="bookmark" />
                Bạn đang mượn
              </span>
              <strong data-testid="borrowed-count">
                {borrowedIds.length}
                <small> / {MAX_BORROWED_BOOKS}</small>
              </strong>
              <p>
                {MAX_BORROWED_BOOKS - borrowedIds.length} chỗ còn lại trên kệ
                sách của bạn
              </p>
            </article>
            <article>
              <span>
                <Icon name="check" />
                Bản sách sẵn có
              </span>
              <strong>{availableCopies}</strong>
              <p>Có thể mượn ngay tại thư viện</p>
            </article>
          </div>
          <div className="stats-body">
            <article className="category-chart">
              <div className="chart-heading">
                <div>
                  <p className="section-kicker">PHÂN BỐ ĐẦU SÁCH</p>
                  <h2>Ba lĩnh vực. Nhiều góc nhìn.</h2>
                </div>
                <Icon name="chart" />
              </div>
              <div className="category-bars">
                {CATEGORIES.map((category) => (
                  <div className="category-bar-row" key={category}>
                    <div>
                      <span>{category}</span>
                      <strong>
                        {categories[category]} <small>đầu sách</small>
                      </strong>
                    </div>
                    <div className="category-track">
                      <span
                        style={{
                          width:
                            (books.length
                              ? (categories[category] / books.length) * 100
                              : 0) + '%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="chart-note">
                Mỗi đầu sách được tính một lần, không phụ thuộc số bản.
              </p>
            </article>
            <article className="stats-reading">
              <Icon name="book" />
              <h2>
                Con số nhỏ,
                <br />
                <em>khám phá lớn.</em>
              </h2>
              <p>
                {borrowedIds.length
                  ? 'Bạn đang mang theo ' +
                    borrowedIds.length +
                    ' cuốn sách. Mỗi trang đọc thêm là một góc nhìn mới.'
                  : 'Một cuốn sách hay có thể là khởi đầu cho ý tưởng tiếp theo của bạn.'}
              </p>
              <Link className="button button-primary" to="/">
                Khám phá sách
                <Icon name="arrow" />
              </Link>
            </article>
          </div>
          <section
            className="stats-table-section"
            aria-labelledby="stats-table-heading"
          >
            <h2 id="stats-table-heading">Chi tiết theo thể loại</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Thể loại</th>
                    <th scope="col">Đầu sách</th>
                    <th scope="col">Bản còn lại</th>
                    <th scope="col">Bạn đang mượn</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((row) => (
                    <tr key={row.category}>
                      <th scope="row">{row.category}</th>
                      <td>{row.titles}</td>
                      <td>{row.available}</td>
                      <td>{row.borrowed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
