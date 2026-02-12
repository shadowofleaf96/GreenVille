import ConfirmOrder from "@/app/(frontoffice)/cart/confirmOrder/ConfirmOrder";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Confirm Order",
  };
}

export default function ConfirmOrderPage() {
  return <ConfirmOrder />;
}
