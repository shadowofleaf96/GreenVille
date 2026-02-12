import Payment from "@/app/(frontoffice)/cart/payment/Payment";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Payment",
  };
}

export default function PaymentPage() {
  return <Payment />;
}
