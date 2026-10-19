import { API_DELAY_MS, getBooks } from './booksApi';
import { isApiSuccess } from '../shared/types/api';

describe('mock books API', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  test('resolves after 500 ms with a typed success response', async () => {
    const completed = jest.fn();
    const request = getBooks();
    void request.then(completed);
    jest.advanceTimersByTime(API_DELAY_MS - 1);
    await Promise.resolve();
    expect(completed).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    const result = await request;
    expect(completed).toHaveBeenCalledTimes(1);
    expect(isApiSuccess(result)).toBe(true);
    if (isApiSuccess(result)) expect(result.data).toHaveLength(15);
  });
  test('the parameter enables the API failure response', async () => {
    const request = getBooks(true);
    jest.advanceTimersByTime(API_DELAY_MS);
    const result = await request;
    expect(isApiSuccess(result)).toBe(false);
    if (!isApiSuccess(result))
      expect(result.error).toContain('Chưa thể kết nối');
  });
  test('requests return independent inventory objects', async () => {
    const firstRequest = getBooks();
    const secondRequest = getBooks();
    jest.advanceTimersByTime(API_DELAY_MS);
    const [first, second] = await Promise.all([firstRequest, secondRequest]);
    if (!isApiSuccess(first) || !isApiSuccess(second))
      throw new Error('Expected successful API');
    expect(first.data).toHaveLength(15);
    expect(first.data[0]).not.toBe(second.data[0]);
  });
});
