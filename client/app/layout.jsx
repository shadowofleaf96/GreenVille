import "./globals.css";
import Providers from "./Providers";

import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const seo = settings?.seo;
  const currentLang = "en"; // Default

  const title =
    seo?.meta_title?.[currentLang] ||
    settings?.website_title?.[currentLang] ||
    "GreenVille";

  const description =
    seo?.meta_description?.[currentLang] ||
    "Your one-stop shop for everything green.";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    icons: {
      icon: settings?.logo_url || "/favicon.ico",
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: [seo?.og_image || settings?.logo_url || ""],
    },
  };
}

import GlobalErrorBoundary from "@/components/shared/ErrorBoundary";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalErrorBoundary>
          <Providers>{children}</Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
