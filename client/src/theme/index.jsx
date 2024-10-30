import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

import { palette } from "./palette";
import { overrides } from './overrides';
import { shadows } from "./shadows";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  const { i18n } = useTranslation();

  const isRtl = i18n.language === 'ar';
  
  const memoizedValue = useMemo(() => {
    return {
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      direction: isRtl ? "rtl" : "ltr",
      shape: { borderRadius: 8 },
      components: {
        MuiPagination: {
          defaultProps: {
            dir: isRtl ? "rtl" : "ltr",
          },
        },
      },
    };
  }, [isRtl]);


  const theme = createTheme(memoizedValue);

  theme.components = overrides(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
