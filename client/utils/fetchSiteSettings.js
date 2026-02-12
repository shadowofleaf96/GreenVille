export const fetchSiteSettings = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.warn("NEXT_PUBLIC_BACKEND_URL is not defined");
      return null;
    }

    const res = await fetch(`${backendUrl}/v1/site-settings`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      // Log error but don't crash
      console.error("Failed to fetch site settings:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data; // Assuming response structure is { success: true, data: { ... } }
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
};
