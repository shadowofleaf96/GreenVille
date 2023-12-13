/* eslint-disable perfectionist/sort-imports */
import { useScrollToTop } from '../src/backoffice/hooks/use-scroll-to-top';

import Router from '../src/routes/sections';
import ThemeProvider from '../src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}