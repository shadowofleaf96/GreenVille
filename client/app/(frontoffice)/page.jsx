import Home from "./Home";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const title = settings?.website_title?.en || "Home";

  return {
    title: "Home",
    // description: ... // layout.jsx handling is likely sufficient unless home specific description exists
  };
}

export default function HomePage() {
  return <Home />;
}
