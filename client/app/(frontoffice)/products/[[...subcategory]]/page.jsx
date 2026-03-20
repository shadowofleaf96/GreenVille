import Products from "../../_components/products/Products";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

export async function generateMetadata() {
  return {
    title: "Our Catalog",
  };
}

export default function ProductsPage() {
  return <Products />;
}
