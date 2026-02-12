import Products from "../../_components/products/Products";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: "Products",
  };
}

export default function ProductsPage() {
  return <Products />;
}
