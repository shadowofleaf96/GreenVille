import Success from "@/app/(frontoffice)/cart/success/Success";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Order Success",
  };
}

export default function SuccessPage() {
  return <Success />;
}
