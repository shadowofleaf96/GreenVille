import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSettings } from "../../redux/backoffice/settingsSlice";
import { fetchLocalizations } from "../../redux/backoffice/localizationSlice";
import i18n from "i18next";

import { hexToHsl } from "../../utils/color-convert";

const DynamicThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { data: localizations } = useSelector(
    (state) => state.adminLocalization,
  );

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchLocalizations());
  }, [dispatch]);

  React.useLayoutEffect(() => {
    const cachedSettings = localStorage.getItem("site_settings");
    let activeSettings = settings;

    if (!activeSettings && cachedSettings) {
      try {
        activeSettings = JSON.parse(cachedSettings);
      } catch (e) {
        console.error("Failed to parse cached settings", e);
      }
    }

    if (activeSettings && activeSettings.theme) {
      const { primary_color, secondary_color, accent_color, bgColor } =
        activeSettings.theme;

      const root = document.documentElement;
      if (primary_color) {
        root.style.setProperty("--color-green_avocado", primary_color);
        root.style.setProperty("--color-logo", primary_color);
        root.style.setProperty("--color-primary", primary_color);
        root.style.setProperty("--primary", `hsl(${hexToHsl(primary_color)})`);
        root.style.setProperty("--ring", `hsl(${hexToHsl(primary_color)})`);
      }
      if (secondary_color) {
        root.style.setProperty("--color-golden", secondary_color);
        root.style.setProperty("--color-secondary", secondary_color);
        root.style.setProperty(
          "--secondary",
          `hsl(${hexToHsl(secondary_color)})`,
        );
      }
      if (accent_color) root.style.setProperty("--color-beige", accent_color);
      if (bgColor) root.style.setProperty("--color-white", bgColor);
    }
  }, [settings]);

  useEffect(() => {
    if (localizations && localizations.length > 0) {
      const resources = { en: {}, fr: {}, ar: {} };

      localizations.forEach((item) => {
        if (item.key) {
          if (item.en) resources.en[item.key] = item.en;
          if (item.fr) resources.fr[item.key] = item.fr;
          if (item.ar) resources.ar[item.key] = item.ar;
        }
      });

      Object.keys(resources).forEach((lng) => {
        if (Object.keys(resources[lng]).length > 0) {
          i18n.addResourceBundle(
            lng,
            "translation",
            resources[lng],
            true,
            true,
          );
        }
      });
    }
  }, [localizations]);

  return <>{children}</>;
};

export default DynamicThemeProvider;
