import { useState, useEffect, useCallback } from "react";

const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// ----------------------------------------------------------------------

export function useResponsive(query, start, end) {
  const getQuery = useCallback(() => {
    switch (query) {
      case "up":
        return `(min-width: ${breakpoints[start]}px)`;
      case "down":
        return `(max-width: ${breakpoints[start]}px)`;
      case "between":
        return `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end]}px)`;
      case "only": {
        // For 'only', we use the range from current to next breakpoint
        const keys = Object.keys(breakpoints);
        const startIdx = keys.indexOf(start);
        const endVal = breakpoints[keys[startIdx + 1]] || 9999;
        return `(min-width: ${breakpoints[start]}px) and (max-width: ${
          endVal - 0.05
        }px)`;
      }
      default:
        return "";
    }
  }, [query, start, end]);

  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(getQuery()).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(getQuery());

    const listener = (event) => setMatches(event.matches);

    // Support older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [getQuery]);

  return matches;
}

// ----------------------------------------------------------------------

export function useWidth() {
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < breakpoints.sm) return "xs";
      if (w < breakpoints.md) return "sm";
      if (w < breakpoints.lg) return "md";
      if (w < breakpoints.xl) return "lg";
      return "xl";
    }
    return "xs";
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < breakpoints.sm) setWidth("xs");
      else if (w < breakpoints.md) setWidth("sm");
      else if (w < breakpoints.lg) setWidth("md");
      else if (w < breakpoints.xl) setWidth("lg");
      else setWidth("xl");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
