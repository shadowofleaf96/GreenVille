import Home from "./Home";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const title = settings?.website_title?.en || "Home";
  const seo = settings?.seo;

  return {
    title: title,
    description: seo?.meta_description?.en || settings?.website_description?.en,
    openGraph: {
      title: title,
      description: seo?.meta_description?.en,
      images: [seo?.og_image || settings?.logo_url || ""],
    },
  };
}

export default function HomePage() {
  return <Home />;
}
