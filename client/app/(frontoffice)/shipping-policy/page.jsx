import ShippingDelivery from "@/frontoffice/policies/ShippingDelivery";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Shipping",
  };
}

export default function ShippingPage() {
  return <ShippingDelivery />;
}
