/* eslint-disable perfectionist/sort-imports */
import { useScrollToTop } from '../src/backoffice/hooks/use-scroll-to-top';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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