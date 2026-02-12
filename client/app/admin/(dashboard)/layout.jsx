"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/admin/_layouts/dashboard";
import Loader from "@/app/(frontoffice)/_components/loader/Loader";
import createAxiosInstance from "@/utils/axiosConfig";
import { fetchUserProfile } from "@/store/slices/admin/authSlice";

export default function ProtectedDashboardLayout({ children }) {
  const userToken =
    typeof window !== "undefined"
      ? localStorage.getItem("user_access_token")
      : null;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.adminAuth);

  const fetchUserData = async () => {
    if (userToken) {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const { status } = await axiosInstance.get("/users/profile");
        if (status >= 200 && status < 300) {
          setIsAuthenticated(true);
          if (!admin) {
            dispatch(fetchUserProfile());
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        toast.error(t("Session expired, please log in again!"));
        localStorage.removeItem("user_access_token");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (isAuthenticated && admin) {
      if (admin.role === "delivery_boy") {
        const allowedPath = "/admin/order";
        const currentPath = pathname.endsWith("/")
          ? pathname.slice(0, -1)
          : pathname;

        // If on Dashboard or any other page, redirect to orders
        if (
          currentPath === "/admin" ||
          (currentPath.startsWith("/admin") && currentPath !== allowedPath)
        ) {
          router.replace(allowedPath);
        }
      }
    }
  }, [loading, isAuthenticated, admin, pathname, router]);

  if (loading || !isAuthenticated) {
    return <Loader />;
  }

  // Wait for profile to be populated in Redux to avoid flicker
  if (!admin) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </DashboardLayout>
  );
}
