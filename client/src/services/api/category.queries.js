import { useQuery } from "@tanstack/react-query";
import createAxiosInstance from "../../utils/axiosConfig";

/**
 * Hook to fetch subcategories.
 */
export const useSubcategories = (role = "admin") => {
  return useQuery({
    queryKey: ["subcategories", role],
    queryFn: async () => {
      const axiosInstance = createAxiosInstance(role);
      const response = await axiosInstance.get("/subcategories");
      return response.data.data;
    },
  });
};

/**
 * Hook to fetch categories.
 */
export const useCategories = (role = "") => {
  return useQuery({
    queryKey: ["categories", role],
    queryFn: async () => {
      const axiosInstance = createAxiosInstance(role);
      const response = await axiosInstance.get("/categories");
      return response.data.data;
    },
  });
};
