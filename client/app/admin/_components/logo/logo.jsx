"use client";

import PropTypes from "prop-types";
import { forwardRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import LazyImage from "@/components/shared/lazyimage/LazyImage";

const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { admin, vendor } = useSelector((state) => state.adminAuth);

  const logoUrl =
    admin?.role === "vendor" && vendor?.store_logo
      ? vendor.store_logo
      : settings?.logo_url || null;

  const logo = (
    <LazyImage
      src={logoUrl}
      className="object-contain cursor-pointer"
      style={{
        width: "auto",
        height: "auto",
        maxWidth: 250,
        maxHeight: 250,
        ...sx,
      }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link href="/admin" style={{ display: "contents" }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
