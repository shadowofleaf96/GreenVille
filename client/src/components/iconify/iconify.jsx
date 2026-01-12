import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

const Iconify = forwardRef(
  ({ icon, width, sx, style, className, ...other }, ref) => (
    <Icon
      ref={ref}
      icon={icon}
      width={width}
      height={width}
      style={{ ...sx, ...style }}
      className={`component-iconify inline-block shrink-0 ${className || ""}`}
      {...other}
    />
  ),
);

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  width: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Iconify;
