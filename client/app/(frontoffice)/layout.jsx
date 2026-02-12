"use client";

import Header from "@/frontoffice/_components/header/Navbar";
import Footer from "@/frontoffice/_components/footer/Footer";
import { usePathname } from "next/navigation";

export default function FrontOfficeLayout({ children }) {
  const pathname = usePathname();
  const authRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/check-email",
    "/set-password",
    "/vendor/register",
  ];

  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={!isAuthPage ? "pt-44" : ""}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
