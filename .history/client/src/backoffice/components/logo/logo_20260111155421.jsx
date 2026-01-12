import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

import LazyImage from "../../../components/lazyimage/LazyImage";

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { admin, vendor } = useSelector((state) => state.adminAuth);

  const logoUrl =
    admin?.role === "vendor" && vendor?.store_logo
      ? vendor.store_logo
      : settings?.logo_url || "/assets/logo.png";

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

  if 

  return (
    <RouterLink to="/admin" style={{ display: "contents" }}>
      {logo}
    </RouterLink>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
