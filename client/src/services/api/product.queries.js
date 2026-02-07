import { useQuery } from "@tanstack/react-query";
import createAxiosInstance from "@/utils/axiosConfig";

/**
 * Hook to fetch products with filters.
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get("/products", { params });
      return response.data;
    },
  });
};

/**
 * Hook to fetch a single product by ID.
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to fetch reviews for a product.
 */
export const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      const axiosInstance = createAxiosInstance("customer");
      const response = await axiosInstance.get(`/reviews/${productId}`);
      return response.data.data;
    },
    enabled: !!productId,
  });
};
