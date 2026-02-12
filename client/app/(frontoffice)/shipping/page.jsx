import Shipping from "@/app/(frontoffice)/cart/shipping/Shipping";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Checkout - Shipping",
  };
}

export default function CheckoutShippingPage() {
  return <Shipping />;
}
