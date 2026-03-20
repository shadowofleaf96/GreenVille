export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/profile/", "/cart", "/payment"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://greenville.com"}/sitemap.xml`,
  };
}
