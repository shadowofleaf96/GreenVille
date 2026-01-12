import PropTypes from "prop-types";
import { forwardRef, Fragment } from "react";
import { useSelector } from "react-redux";

import LazyImage from "../../../components/lazyimage/LazyImage";

const MiniLogo = forwardRef(({ disabledLink = true, sx, ...other }, ref) => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { admin, vendor } = useSelector((state) => state.adminAuth);

  const logoUrl =
    admin?.role === "vendor" && vendor?.store_logo
      ? vendor.store_logo
      : settings?.logo_url ||
        "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5";

  const logo = (
    <LazyImage
      src={logoUrl}
      className="object-contain cursor-pointer"
      style={{
        width: "auto",
        height: "auto",
        maxWidth: 180,
        maxHeight: 180,
        ...sx,
      }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Fragment>
      <hr className="m-4 border-gray-200 dark:border-gray-700" />
      <div>{logo}</div>
    </Fragment>
  );
});

MiniLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default MiniLogo;
