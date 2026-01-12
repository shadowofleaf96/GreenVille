import { useMemo, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";

// ----------------------------------------------------------------------

export const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback or handle cases where useTheme is used outside provider
    return {
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    };
  }
  return context;
};

export default function ThemeProvider({ children }) {
  const { i18n } = useTranslation();

  const isRtl = i18n.language === "ar";

  const theme = useMemo(() => {
    return {
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      direction: isRtl ? "rtl" : "ltr",
      shape: { borderRadius: 8 },
    };
  }, [isRtl]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
