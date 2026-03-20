import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { fetchSettings } from "@/store/slices/admin/settingsSlice";
import { fetchLocalizations } from "@/store/slices/admin/localizationSlice";
import i18n from "i18next";
import Loader from "./loader/Loader";
import React, { useEffect } from "react";

import { hexToHsl } from "@/utils/color-convert";

const DynamicThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data: settings, loading: settingsLoading } = useSelector(
    (state) => state.adminSettings,
  );
  const { data: localizations, loading: localizationsLoading } = useSelector(
    (state) => state.adminLocalization,
  );

  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          dispatch(fetchSettings()).unwrap(),
          dispatch(fetchLocalizations()).unwrap(),
        ]);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setInitialized(true);
      }
    };
    init();
  }, [dispatch]);

  React.useLayoutEffect(() => {
    const cachedSettings = localStorage.getItem("site_settings");
    let activeSettings = settings;

    if (!activeSettings && cachedSettings) {
      try {
        activeSettings = JSON.parse(cachedSettings);
        console.log(
          "DynamicThemeProvider: Loaded cached settings:",
          activeSettings,
        );
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
        console.log(
          "DynamicThemeProvider: Applied primary color:",
          primary_color,
        );
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

      // --- Dynamic Google Fonts ---
      const primaryFont = activeSettings.theme?.primary_font || "Raleway";
      const secondaryFont = activeSettings.theme?.secondary_font || primaryFont;

      const fontFamilies = Array.from(new Set([primaryFont, secondaryFont]));
      const fontUrl = `https://fonts.googleapis.com/css2?${fontFamilies
        .map(
          (f) =>
            `family=${f.replace(/ /g, "+")}:wght@100;200;300;400;500;600;700;800;900`,
        )
        .join("&")}&display=swap`;

      let fontLink = document.getElementById("dynamic-google-fonts");
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = "dynamic-google-fonts";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      }
      fontLink.href = fontUrl;

      root.style.setProperty("--font-body", `"${primaryFont}", sans-serif`);
      root.style.setProperty(
        "--font-heading",
        `"${secondaryFont}", sans-serif`,
      );
      console.log("DynamicThemeProvider: Applied fonts:", {
        primaryFont,
        secondaryFont,
      });
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

  useEffect(() => {
    const isAdminPath = pathname?.startsWith("/admin");
    if (initialized && pathname !== "/setup" && !isAdminPath) {
      const isSetupNeeded =
        !settings || !settings.website_title?.en || !settings.logo_url;
      if (isSetupNeeded) {
        router.push("/setup");
      }
    }
  }, [initialized, settings, pathname, router]);

  if (!initialized) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default DynamicThemeProvider;
