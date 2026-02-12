import PropTypes from "prop-types";
import { alpha } from "../../../theme/css";

// ----------------------------------------------------------------------

export default function ColorPreview({
  colors,
  limit = 3,
  sx,
  className,
  style,
}) {
  const renderColors = colors.slice(0, limit);

  const remainingColor = colors.length - limit;

  return (
    <span
      className={`inline-flex flex-row items-center justify-end ${
        className || ""
      }`}
      style={{ ...style, ...sx }}
    >
      {renderColors.map((color, index) => (
        <div
          key={color + index}
          style={{
            marginLeft: index === 0 ? 0 : -6,
            width: 16,
            height: 16,
            backgroundColor: color,
            borderRadius: "50%",
            border: "solid 2px #FFFFFF",
            boxShadow: `inset -1px 1px 2px ${alpha("#000000", 0.24)}`,
          }}
        />
      ))}

      {colors.length > limit && (
        <span className="text-sm font-semibold ml-1">{`+${remainingColor}`}</span>
      )}
    </span>
  );
}

ColorPreview.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  limit: PropTypes.number,
  sx: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
