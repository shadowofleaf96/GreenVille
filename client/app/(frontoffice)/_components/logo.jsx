"use client";

import { useSelector } from "react-redux";
import LazyImage from "@/components/shared/lazyimage/LazyImage";

const Logo = ({ className }) => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const logoUrl =
    settings?.logo_url ||
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5";

  return (
    <LazyImage
      className={`w-36 h-auto object-contain ${className || ""}`}
      src={logoUrl}
      alt="GreenVille Logo"
    />
  );
};

export default Logo;
