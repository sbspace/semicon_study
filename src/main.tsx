import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App.js';
import { browserContentLoader } from './app/content.js';
import { ContentProvider } from './app/ContentContext.js';
import { ProgressProvider } from './progress/ProgressContext.js';
import './app/styles.css';

const root = document.getElementById('root');
if (root === null) throw new Error('Missing #root application mount point');

createRoot(root).render(
  <StrictMode>
    <ContentProvider loader={browserContentLoader}>
      <ProgressProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </ProgressProvider>
    </ContentProvider>
  </StrictMode>,
);
