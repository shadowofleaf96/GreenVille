import Login from "./Login";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  // Login page specific logic if needed
  return {
    title: "Login",
  };
}

export default function LoginPage() {
  return <Login />;
}
