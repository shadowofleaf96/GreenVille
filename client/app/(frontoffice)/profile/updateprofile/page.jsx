export const dynamic = "force-dynamic";
import UpdateProfile from "@/app/(frontoffice)/profile/_components/updateProfile/UpdateProfile";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Edit Profile",
  };
}

export default function UpdateProfilePage() {
  return <UpdateProfile />;
}
