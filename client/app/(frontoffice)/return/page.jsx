import ReturnsExchanges from "../policies/ReturnsExchanges";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Returns & Exchanges",
  };
}

export default function ReturnPage() {
  return <ReturnsExchanges />;
}
