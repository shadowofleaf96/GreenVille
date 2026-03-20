import About from "./About";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  return {
    title: "About Us",
  };
}

export default function AboutPage() {
  return <About />;
}
