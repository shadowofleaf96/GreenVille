import "./globals.css";
import Providers from "./Providers";
import { Raleway } from "next/font/google";

import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-raleway",
});

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
    <html lang="en" className={raleway.variable}>
      <body>
        <GlobalErrorBoundary>
          <Providers>{children}</Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
