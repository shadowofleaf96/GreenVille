import { useEffect } from 'react'; // Import useEffect
import { useScrollToTop } from '../src/backoffice/hooks/use-scroll-to-top';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Router from '../src/routes/sections';
import ThemeProvider from '../src/theme';
import { useTranslation } from 'react-i18next';


// ----------------------------------------------------------------------

export default function App() {
  const { i18n } = useTranslation();

  useScrollToTop();

  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </div>
  );
}
