import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { store } from './app/store';
import { ThemeProvider } from './features/theme/ThemeProvider';
import { applyTheme, readTheme } from './features/theme/theme';
import './styles.css';

applyTheme(readTheme());
const root = document.getElementById('root');
if (!root) throw new Error('Không tìm thấy phần tử root.');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
