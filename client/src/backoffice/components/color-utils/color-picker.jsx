import PropTypes from "prop-types";
import { forwardRef, useCallback } from "react";
import { alpha } from "../../../theme/css";
import Iconify from "../iconify";

// ----------------------------------------------------------------------

const getContrastText = (color) => {
  if (!color) return "#000000";
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const ColorPicker = forwardRef(
  (
    {
      colors,
      selected,
      onSelectColor,
      limit = "auto",
      sx,
      className,
      style,
      ...other
    },
    ref,
  ) => {
    const singleSelect = typeof selected === "string";

    const handleSelect = useCallback(
      (color) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.includes(color)
            ? selected.filter((value) => value !== color)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect],
    );

    return (
      <div
        ref={ref}
        className={`inline-flex flex-row flex-wrap ${className || ""}`}
        style={{
          ...(limit !== "auto" && {
            width: limit * 36,
            justifyContent: "flex-end",
          }),
          ...style,
          ...sx,
        }}
        {...other}
      >
        {colors.map((color) => {
          const hasSelected = singleSelect
            ? selected === color
            : selected.includes(color);

          return (
            <button
              key={color}
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-black/5 focus:outline-none"
              onClick={() => {
                handleSelect(color);
              }}
            >
              <div
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: color,
                  borderRadius: "50%",
                  border: `solid 1px ${alpha("#919EAB", 0.16)}`,
                  ...(hasSelected && {
                    transform: "scale(1.3)",
                    boxShadow: `4px 4px 8px 0 ${alpha(color, 0.48)}`,
                    outline: `solid 2px ${alpha(color, 0.08)}`,
                  }),
                }}
              >
                <Iconify
                  width={hasSelected ? 12 : 0}
                  icon="material-symbols-light:check-box-outline-rounded"
                  style={{
                    color: getContrastText(color),
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  },
);

ColorPicker.propTypes = {
  colors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelectColor: PropTypes.func,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  sx: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ColorPicker;
