import Register from "./Register";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Register",
  };
}

export default function RegisterPage() {
  return <Register />;
}
