export const dynamic = "force-dynamic";
import MyOrders from "@/app/(frontoffice)/profile/_components/myOrders/MyOrders";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "My Orders",
  };
}

export default function MyOrdersPage() {
  return <MyOrders />;
}
