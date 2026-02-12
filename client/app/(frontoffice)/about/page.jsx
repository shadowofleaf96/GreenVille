import About from "./About";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const aboutPage = settings?.about_page;
  // Fallback title/desc if not found in settings, or let layout handle defaults.
  // But typically About page has specific title.

  return {
    title: "About Us",
    // description: ...
  };
}

export default function AboutPage() {
  return <About />;
}
