// ----------------------------------------------------------------------

export function alpha(color, opacity) {
  if (!color) return "";

  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (color.startsWith("rgb")) {
    return color.replace(")", `, ${opacity})`).replace("rgb", "rgba");
  }

  return color;
}

// ----------------------------------------------------------------------

export const paper = ({ theme, bgcolor, dropdown }) => ({
  ...bgBlur({
    blur: 20,
    opacity: 0.9,
    color: theme?.palette?.background?.paper || "#FFFFFF",
    ...(!!bgcolor && {
      color: bgcolor,
    }),
  }),
  backgroundImage: "url(/assets/cyan-blur.webp), url(/assets/red-blur.webp)",
  backgroundRepeat: "no-repeat, no-repeat",
  backgroundPosition: "top right, left bottom",
  backgroundSize: "50%, 50%",
  ...(theme?.direction === "rtl" && {
    backgroundPosition: "top left, right bottom",
  }),
  ...(dropdown && {
    padding: "4px",
    boxShadow: theme?.customShadows?.dropdown,
    borderRadius: "10px",
  }),
});

// ----------------------------------------------------------------------

export const menuItem = (theme) => ({
  padding: "6px 8px",
  borderRadius: "6px",
  "&:not(:last-of-type)": {
    marginBottom: 4,
  },
  "&.selected": {
    fontWeight: 600,
    backgroundColor: alpha("#919EAB", 0.16),
    "&:hover": {
      backgroundColor: alpha("#919EAB", 0.08),
    },
  },
});

// ----------------------------------------------------------------------

export function bgBlur(props) {
  const color = props?.color || "#000000";
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&:before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

export function bgGradient(props) {
  const direction = props?.direction || "to bottom";
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

export function textGradient(value) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

// ----------------------------------------------------------------------

export const hideScroll = {
  x: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowX: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  y: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};
