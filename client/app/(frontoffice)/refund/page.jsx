import RefundPolicy from "../policies/RefundPolicy";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Refund Policy",
  };
}

export default function RefundPage() {
  return <RefundPolicy />;
}
