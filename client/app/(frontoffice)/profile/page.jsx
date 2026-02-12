export const dynamic = "force-dynamic";
import MyProfile from "@/app/(frontoffice)/profile/_components/myProfile/MyProfile";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "My Profile",
  };
}

export default function ProfilePage() {
  return <MyProfile />;
}
