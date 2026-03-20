import createAxiosInstance from "@/utils/axiosConfig";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://greenville.com";

  // Base routes
  const routes = ["", "/products", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const axiosInstance = createAxiosInstance("customer");

    // Fetch products for sitemap
    const productsRes = await axiosInstance.get(
      "/products?limit=1000&status=true",
    );
    const products = productsRes.data?.data || [];

    const productEntries = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug || product._id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    // Fetch categories for sitemap
    const categoriesRes = await axiosInstance.get("/categories");
    const categories = categoriesRes.data || [];

    const categoryEntries = categories.map((category) => ({
      url: `${baseUrl}/products?category=${category._id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    return [...routes, ...productEntries, ...categoryEntries];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
