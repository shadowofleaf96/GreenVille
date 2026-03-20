"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/frontoffice/_components/loader/Loader";

export default function ProfileLayout({ children }) {
  const { customer, loading, customerToken } = useSelector(
    (state) => state.customers,
  );
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Middleware handles the initial redirect if cookie is missing.
    // This client-side check handles the case where Redux state might be cleared
    // or the token in localStorage is invalid but the cookie exists (rare but possible).
    const token = localStorage.getItem("customer_access_token");

    if (!loading) {
      if (!token && !customerToken) {
        router.replace(`/login?redirect=${pathname}`);
      } else {
        setIsVerifying(false);
      }
    }
  }, [customerToken, loading, router, pathname]);

  if (loading || isVerifying) {
    return <Loader />;
  }

  return <>{children}</>;
}
