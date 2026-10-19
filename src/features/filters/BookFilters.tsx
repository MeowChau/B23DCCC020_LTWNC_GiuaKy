import { useId } from 'react';
import { Icon } from '../../shared/components/Icon';
import { CATEGORIES } from '../books/types';
import type { CategoryCounts } from '../books/types';
import { useFilterStore } from './filterStore';

export function BookFilters({
  counts,
  total,
}: {
  counts: CategoryCounts;
  total: number;
}) {
  const id = useId();
  const search = useFilterStore((state) => state.search);
  const category = useFilterStore((state) => state.category);
  const setSearch = useFilterStore((state) => state.setSearch);
  const setCategory = useFilterStore((state) => state.setCategory);
  const reset = useFilterStore((state) => state.reset);
  return (
    <div className="catalog-controls">
      <div className="search-box">
        <Icon name="search" />
        <label className="sr-only" htmlFor={id}>
          Tìm theo tên sách hoặc tác giả
        </label>
        <input
          id={id}
          type="search"
          autoComplete="off"
          placeholder="Bạn muốn đọc gì? Tìm sách hoặc tác giả…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {search && (
          <button
            className="icon-button"
            type="button"
            aria-label="Xoá từ khoá"
            onClick={() => setSearch('')}
          >
            <Icon name="close" />
          </button>
        )}
        <span className="search-shortcut" aria-hidden="true">
          <Icon name="book" />
        </span>
      </div>
      <div className="filter-line">
        <div
          className="category-filters"
          role="group"
          aria-label="Lọc theo thể loại"
        >
          <button
            type="button"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            Tất cả<span>{total}</span>
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
              <span>{counts[item]}</span>
            </button>
          ))}
        </div>
        {(search.trim() || category !== 'all') && (
          <button className="reset-filters" type="button" onClick={reset}>
            <Icon name="close" />
            Xoá bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
