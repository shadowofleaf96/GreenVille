import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScrollToTop } from "../src/backoffice/hooks/use-scroll-to-top";
import Router from "../src/routes/sections";
import { useTranslation } from "react-i18next";
import Loader from "./frontoffice/components/loader/Loader";
import { fetchSettings } from "./redux/backoffice/settingsSlice";
import DynamicThemeProvider from "./frontoffice/components/DynamicThemeProvider";

import ErrorBoundary from "./frontoffice/components/ErrorBoundary";
import MaintenancePage from "./frontoffice/pages/failsafe/MaintenancePage";
import { HelmetProvider } from "react-helmet-async";

// ----------------------------------------------------------------------

export default function App() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { data: settings, error } = useSelector((state) => state.adminSettings);

  useScrollToTop();

  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      i18n.language === "ar" ? "rtl" : "ltr"
    );
  }, [i18n.language]);

  useEffect(() => {
    dispatch(fetchSettings());
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error || !settings || Object.keys(settings).length === 0) {
    return <MaintenancePage />;
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <DynamicThemeProvider>
          <Router />
        </DynamicThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
