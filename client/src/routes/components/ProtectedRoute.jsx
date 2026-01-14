import { Suspense, useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../backoffice/layouts/dashboard";
import Loader from "../../frontoffice/components/loader/Loader";
import { toast } from "react-toastify";
import createAxiosInstance from "../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { fetchUserProfile } from "../../redux/backoffice/authSlice";

const ProtectedRoute = () => {
  const userToken = localStorage.getItem("user_access_token");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { pathname } = useLocation();
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

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    // Wait for profile to be populated in Redux to avoid flicker and ensure role-based redirection
    if (!admin) {
      return <Loader />;
    }

    // Enforce Delivery Boy Restrictions
    if (admin?.role === "delivery_boy") {
      const allowedPath = "/admin/order";
      const currentPath = pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;

      // If on Dashboard or any other page, redirect to orders
      if (
        currentPath === "/admin" ||
        (currentPath.startsWith("/admin") && currentPath !== allowedPath)
      ) {
        return <Navigate to={allowedPath} replace />;
      }
    }

    return (
      <DashboardLayout>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    );
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
