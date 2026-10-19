import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce<T>', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  test('keeps the previous value until exactly 300 ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'React' } },
    );
    rerender({ value: 'Redux' });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('React');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('Redux');
  });
  test('restarts the timer after each change and supports non-string values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 1 } },
    );
    rerender({ value: 2 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 3 });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe(1);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(3);
  });
  test('clears its pending timeout on unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: '' } },
    );
    rerender({ value: 'pending' });
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
