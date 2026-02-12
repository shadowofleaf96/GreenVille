import PropTypes from "prop-types";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const SvgColor = forwardRef(({ src, sx, style, className, ...other }, ref) => (
  <span
    ref={ref}
    className={`svg-color inline-block ${className || ""}`}
    style={{
      width: 24,
      height: 24,
      backgroundColor: "currentColor",
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...style,
      ...sx,
    }}
    {...other}
  />
));

SvgColor.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default SvgColor;
