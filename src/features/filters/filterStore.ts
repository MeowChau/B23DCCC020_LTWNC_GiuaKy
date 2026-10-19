import { create } from 'zustand';
import type { Category } from '../books/types';

export type CategoryFilter = Category | 'all';

interface FilterState {
  search: string;
  category: CategoryFilter;
  setSearch: (search: string) => void;
  setCategory: (category: CategoryFilter) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  search: '',
  category: 'all',
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  reset: () => set({ search: '', category: 'all' }),
}));
