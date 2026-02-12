import Contact from "./Contact";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const contactPage = settings?.contact_page;
  const seo = settings?.seo;

  const currentLang = "en"; // Default or detect from headers/cookies if possible, but basic SEO often defaults to main lang or needs i18n routing

  const siteTitle =
    seo?.meta_title?.[currentLang] ||
    settings?.website_title?.[currentLang] ||
    "GreenVille";

  const title = `Contact Us | ${siteTitle}`;
  const description =
    seo?.meta_description?.[currentLang] ||
    "Get in touch with Greenville luxury selection.";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      // images: [seo?.og_image || settings?.logo_url || ""], // Uncomment if images are available
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // images: [seo?.og_image || settings?.logo_url || ""],
    },
  };
}

export default function ContactPage() {
  return <Contact />;
}
