export const dynamic = "force-dynamic";
import UpdateAddress from "@/app/(frontoffice)/profile/_components/updateAddress/UpdateAddress";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Update Address",
  };
}

export default function UpdateAddressPage() {
  return <UpdateAddress />;
}
