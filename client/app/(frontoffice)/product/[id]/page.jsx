import SingleProduct from "./SingleProduct";
import { fetchSiteSettings } from "@/utils/fetchSiteSettings";

async function fetchProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const settings = await fetchSiteSettings();
  const productData = await fetchProduct(id);
  if (!productData) {
    return {
      title: "Product Not Found",
    };
  }

  const product = productData || {};
  const currentLang = "en";

  const title =
    product?.product_name?.[currentLang] ||
    product?.product_name?.en ||
    "Product";
  const description =
    product?.short_description?.[currentLang] ||
    product?.short_description?.en ||
    "";
  const image = product?.product_images?.[0] || "";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [image],
    },
  };
}

export default async function SingleProductPage({ params }) {
  const { id } = await params;
  return <SingleProduct id={id} />;
}
