import { lazy, Suspense, useEffect } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { selectBorrowedIds } from '../features/books/booksSelectors';
import { fetchBooks } from '../features/books/booksSlice';
import { LibraryNotice } from '../features/books/components/LibraryNotice';
import { MAX_BORROWED_BOOKS } from '../features/books/types';
import { useTheme } from '../features/theme/useTheme';
import CatalogPage from '../pages/CatalogPage';
import { Icon } from '../shared/components/Icon';
import { LoadingState } from '../shared/components/LoadingState';
import { useAppDispatch, useAppSelector } from './hooks';

const StatsPage = lazy(() => import('../pages/StatsPage'));

export function App() {
  const dispatch = useAppDispatch();
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    const simulateError =
      new URLSearchParams(window.location.search).get('apiError') === '1';
    void dispatch(fetchBooks(simulateError));
  }, [dispatch]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Mini Library — Trang chủ">
            <span className="brand-mark">
              <Icon name="book" />
            </span>
            <span>
              mini library<small>THƯ VIỆN CỦA KHOA</small>
            </span>
          </Link>
          <nav className="main-nav" aria-label="Điều hướng chính">
            <NavLink to="/" end>
              <Icon name="book" />
              Khám phá
            </NavLink>
            <NavLink to="/stats">
              <Icon name="chart" />
              Thống kê
            </NavLink>
          </nav>
          <div className="header-actions">
            <span className="header-loan-count">
              <Icon name="bookmark" />
              Đang mượn
              <strong>
                {borrowedIds.length}/{MAX_BORROWED_BOOKS}
              </strong>
            </span>
            <button
              className="theme-toggle"
              type="button"
              aria-label={
                theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'
              }
              title={
                theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'
              }
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <span className="student-avatar" title="Không gian sinh viên">
              SV
            </span>
          </div>
        </div>
      </header>
      <main className="page-container" id="main-content">
        <Suspense fallback={<LoadingState compact />}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route
              path="*"
              element={
                <div className="not-found">
                  <Icon name="book" />
                  <h1>Trang này chưa có trên kệ.</h1>
                  <p>Quay về thư viện để tiếp tục khám phá nhé.</p>
                  <Link className="button button-primary" to="/">
                    Về thư viện
                    <Icon name="arrow" />
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">Nguyễn Minh Châu - B23DCCC020</footer>
      <LibraryNotice />
    </div>
  );
}
