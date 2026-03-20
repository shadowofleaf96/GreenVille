import Contact from "./Contact";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  return {
    title: "Contact Us",
  };
}

export default function ContactPage() {
  return <Contact />;
}
