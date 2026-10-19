# Mini Library

Ứng dụng tra cứu và mượn/trả sách cho sinh viên. Bài giữa kỳ dùng React, TypeScript, Redux Toolkit, Zustand, Context và Jest.

## Chạy dự án

Cần Node.js 22.12 trở lên (Node.js 24 cũng dùng được).

```powershell
cd D:\TH_Web_Nc\Slide\Giua_ky
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ Vite in trong terminal, mặc định http://127.0.0.1:5173. Trên terminal cho phép chạy npm bình thường, có thể dùng npm thay npm.cmd.

```bash
npm test
npm run typecheck
npm run build
npm run preview
```

npm test chạy 33 test Jest một lần rồi thoát. npm run test:watch bật chế độ theo dõi. npm run test:coverage xuất báo cáo vào coverage/.

## Chức năng và quy ước

- API mẫu trả 15 đầu sách thuộc CNTT, Kinh tế, Ngoại ngữ, trễ 500 ms. Có loading, thông báo lỗi và thử lại.
- Tìm theo tên hoặc tác giả: không phân biệt hoa thường, hỗ trợ cả tiếng Việt không dấu; debounce 300 ms.
- Lọc thể loại kết hợp với từ khoá. Các con số trên nút thể loại tính trên toàn danh mục; dòng kết quả tính theo bộ lọc.
- Mượn giảm một bản, trả tăng một bản. Sách hết bản có nút Mượn bị vô hiệu hoá.
- Mỗi sinh viên mượn tối đa 3 cuốn cùng lúc, mỗi đầu sách một bản. Sách đang mượn hiện nút Trả và nằm trong kệ sách bên phải.
- Khi đã mượn 3 cuốn, nút Mượn của sách khác vẫn nhận thao tác để middleware chặn action và hiển thị cảnh báo rõ ràng. Reducer không chứa quy tắc giới hạn 3 cuốn.
- Theme sáng/tối mặc định theo hệ điều hành; lựa chọn thủ công lưu trong localStorage.
- /stats hiển thị số đầu sách từng thể loại, số bản còn lại và số cuốn bạn đang mượn. Trang này được lazy load.
- Mượn/trả được giữ khi chuyển route trong cùng phiên chạy. Tải lại toàn bộ trang bắt đầu lại dữ liệu mẫu và lượt mượn; theme vẫn được giữ.
- Bìa mặc định là minh hoạ CSS/SVG. Mỗi sách có thể gán ảnh thật qua coverUrl; nếu để trống hoặc ảnh tải lỗi, app dùng lại bìa minh hoạ.

## Gán ảnh bìa sách

Mở src/api/booksData.ts, tìm sách cần sửa và dán link ảnh vào trường coverUrl đã có sẵn:

```ts
coverUrl: 'https://example.com/clean-code.jpg',
```

Dùng link trả trực tiếp nội dung ảnh. Ảnh tự hiển thị ở cả danh mục và kệ đang mượn. Để coverUrl là chuỗi rỗng nếu muốn dùng bìa minh hoạ; nếu link lỗi, app tự trở về bìa minh hoạ và sẽ thử ảnh mới khi bạn đổi link.

Bạn cũng có thể đặt ảnh trong public/images/books/clean-code.jpg và gán coverUrl: '/images/books/clean-code.jpg'. Đường dẫn này không có tiền tố /public. Ảnh được giữ nguyên tỉ lệ, hỗ trợ cả bìa lớn và bìa nhỏ.

## Thử trường hợp API lỗi

Mở http://127.0.0.1:5173/?apiError=1 (đổi cổng nếu Vite dùng cổng khác). Sau 500 ms sẽ thấy thông báo lỗi. Nhấn Thử lại để gọi API thành công sau 500 ms.

API nằm trong src/api/booksApi.ts:

```ts
getBooks(); // Promise<ApiResult<Book[]>>, thành công sau 500 ms
getBooks(true); // { ok: false, error }, cũng sau 500 ms
```

ApiResult<T> là discriminated union { ok: true; data: T } | { ok: false; error: string }. Thunk dùng type guard isApiSuccess để thu hẹp kiểu, và rejectWithValue cho nhánh lỗi. Lỗi bất ngờ được bắt dưới kiểu unknown.

## Đối chiếu yêu cầu kỹ thuật

| Yêu cầu                                | Cài đặt                                                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript đầy đủ, generic, type guard | Book, BooksState, ApiResult<T>, isApiSuccess<T>; strict TypeScript, không khai báo kiểu any                                       |
| Ít nhất hai Utility Type               | Pick<Book, ...> cho BorrowedBook; Record<Category, number> cho thống kê; Readonly<Book> cho props; Partial<Book> cho fixture test |
| Redux Toolkit + TypeScript             | createSlice, createAsyncThunk và pending/fulfilled/rejected trong booksSlice.ts; typed hooks trong app/hooks.ts                   |
| Feature-based                          | features/books, features/filters, features/theme                                                                                  |
| Middleware tự viết                     | borrowLimitMiddleware.ts kiểm tra action bằng borrowBook.match, đọc store, phát cảnh báo và không gọi next khi vượt giới hạn      |
| Zustand                                | features/filters/filterStore.ts giữ từ khoá và thể loại                                                                           |
| Context + useMemo                      | ThemeProvider memo hoá value; useTheme kiểm tra provider                                                                          |
| Hook generic                           | shared/hooks/useDebounce.ts có useDebounce<T>, timeout 300 ms và cleanup                                                          |
| useMemo                                | Danh sách sau lọc, sách đang mượn, số đầu sách theo loại và dữ liệu thống kê                                                      |
| React.memo, useCallback, key           | BookCard bọc memo; handler mượn/trả dùng useCallback; danh sách key=book.id                                                       |
| Lazy route                             | React.lazy import StatsPage; Suspense trong App; BrowserRouter hỗ trợ URL /stats                                                  |
| Jest + React Testing Library           | Kiểm thử reducer, middleware, API/thunk, BookCard + userEvent, useDebounce + fake timers, tìm kiếm/lọc                            |

## Cấu trúc

```text
src/
  api/
    booksApi.ts               # Promise + setTimeout 500ms + tham số giả lỗi
    booksData.ts              # Dữ liệu mẫu bất biến
  app/
    App.tsx                   # Layout, routes, lazy StatsPage, tải dữ liệu ban đầu
    rootReducer.ts            # RootState không tạo vòng import với middleware
    store.ts                  # Store factory và middleware
    hooks.ts                  # useAppSelector/useAppDispatch
  features/
    books/
      booksSlice.ts
      borrowLimitMiddleware.ts
      booksSelectors.ts
      types.ts
      hooks/useLibrary.ts
      components/             # BookCard, BookCover, BorrowedPanel, LibraryNotice
    filters/                  # Zustand và giao diện tìm kiếm/lọc
    theme/                    # Context, provider, useTheme, lưu lựa chọn
  pages/
    CatalogPage.tsx
    StatsPage.tsx
  shared/
    components/               # Icon, LoadingState, ErrorState
    hooks/useDebounce.ts
    types/api.ts
  test/                       # Setup Jest DOM và fixture có kiểu
  main.tsx
  styles.css                  # Token sáng/tối, bìa sách và responsive
```

Babel chỉ biên dịch TypeScript/JSX để Jest chạy; TypeScript kiểm tra kiểu riêng qua typecheck và build. Các test nằm cạnh module/component tương ứng.

## Kiểm tra nhanh khi chấm

1. Mở app, quan sát loading khoảng 500 ms và 15 sách sau khi tải.
2. Nhập tên/tác giả bằng chữ hoa hoặc thường; chờ 300 ms. Kết hợp bộ lọc thể loại.
3. Kiểm tra Design Patterns và Nhà đầu tư thông minh: hết bản, không mượn được.
4. Mượn 3 đầu sách còn bản; thử mượn cuốn thứ tư: cảnh báo xuất hiện, tồn kho cuốn thứ tư không đổi.
5. Trả một cuốn từ thẻ sách hoặc kệ đang mượn; kiểm tra tồn kho tăng và có thể mượn cuốn khác.
6. Vào /stats: thống kê thể loại là 6 CNTT, 5 Kinh tế, 4 Ngoại ngữ; số đang mượn khớp với kệ sách.
7. Đổi theme và tải lại; lựa chọn màu được giữ.
8. Thử URL giả lỗi, nhấn Thử lại.
9. Chạy npm test, npm run typecheck, npm run build.

Khi nộp mã nguồn, loại node_modules/, dist/, coverage/ khỏi ZIP. Giữ node_modules trên máy để VS Code tìm được React và các kiểu TypeScript.

## Tài nguyên giao diện

Font Lora của The Lora Project Authors được lưu trong public/fonts để hỗ trợ đầy đủ tiếng Việt và chạy offline. [Nguồn Google Fonts](https://github.com/google/fonts/tree/main/ofl/lora); giấy phép SIL Open Font License 1.1 đi kèm tại public/fonts/OFL.txt. Các bìa sách và hình minh hoạ còn lại được dựng trực tiếp bằng CSS/SVG.
