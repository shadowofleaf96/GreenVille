import PropTypes from "prop-types";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const Label = forwardRef(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      className,
      style,
      ...other
    },
    ref,
  ) => {
    // Core color mapping based on the project's brand palette
    const colors = {
      default: {
        main: "#919EAB",
        dark: "#454F5B",
        light: "#F4F6F8",
        contrastText: "#FFFFFF",
      },
      primary: {
        main: "#8DC63F",
        dark: "#7DAD35",
        light: "#9BD355",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#709340",
        dark: "#5D7A35",
        light: "#8CB650",
        contrastText: "#FFFFFF",
      },
      info: {
        main: "#00B8D9",
        dark: "#006C9C",
        light: "#61F3F3",
        contrastText: "#FFFFFF",
      },
      success: {
        main: "#00A76F",
        dark: "#007867",
        light: "#5BE49B",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: "#FFAB00",
        dark: "#B76E00",
        light: "#FFD666",
        contrastText: "#212B36",
      },
      error: {
        main: "#FF5630",
        dark: "#B71D18",
        light: "#FFAC82",
        contrastText: "#FFFFFF",
      },
    };

    const colorConfig = colors[color] || colors.default;

    const getStyles = () => {
      const base = {
        height: 24,
        minWidth: 24,
        borderRadius: 6,
        cursor: "default",
        alignItems: "center",
        whiteSpace: "nowrap",
        display: "inline-flex",
        justifyContent: "center",
        textTransform: "capitalize",
        padding: "0 6px",
        fontSize: "0.75rem",
        fontWeight: 700,
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        ...style,
        ...sx,
      };

      if (variant === "filled") {
        return {
          ...base,
          color: colorConfig.contrastText,
          backgroundColor: color === "default" ? "#212B36" : colorConfig.main,
        };
      }

      if (variant === "outlined") {
        return {
          ...base,
          backgroundColor: "transparent",
          color: color === "default" ? "#212B36" : colorConfig.main,
          border: `2px solid ${
            color === "default" ? "#212B36" : colorConfig.main
          }`,
        };
      }

      // Soft (Default)
      return {
        ...base,
        color: color === "default" ? "#637381" : colorConfig.dark,
        backgroundColor: `${colorConfig.main}29`, // Approx 0.16 alpha
      };
    };

    const iconStyles = {
      width: 16,
      height: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg, img": { width: "100%", height: "100%", objectFit: "cover" },
    };

    return (
      <span
        ref={ref}
        style={getStyles()}
        className={`component-label ${className || ""}`}
        {...other}
      >
        {startIcon && (
          <span style={{ ...iconStyles, marginRight: 6 }}>{startIcon}</span>
        )}

        {children}

        {endIcon && (
          <span style={{ ...iconStyles, marginLeft: 6 }}>{endIcon}</span>
        )}
      </span>
    );
  },
);

Label.propTypes = {
  children: PropTypes.node,
  endIcon: PropTypes.object,
  startIcon: PropTypes.object,
  sx: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.oneOf(["filled", "outlined", "ghost", "soft"]),
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
};

export default Label;
