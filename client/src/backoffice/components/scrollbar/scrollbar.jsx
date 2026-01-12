import PropTypes from "prop-types";
import { memo, forwardRef } from "react";
import SimpleBar from "simplebar-react";

// ----------------------------------------------------------------------

const Scrollbar = forwardRef(
  ({ children, sx, style, className, ...other }, ref) => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );

    if (mobile) {
      return (
        <div
          ref={ref}
          style={{ overflow: "auto", ...style, ...sx }}
          className={className}
          {...other}
        >
          {children}
        </div>
      );
    }

    const scrollbarStyles = {
      flexGrow: 1,
      height: "100%",
      overflow: "hidden",
    };

    return (
      <div className="grow h-full overflow-hidden" style={scrollbarStyles}>
        <SimpleBar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          style={{ maxHeight: "100%", ...style, ...sx }}
          className={`custom-scrollbar ${className || ""}`}
          {...other}
        >
          {children}
        </SimpleBar>
        <style>{`
        .custom-scrollbar .simplebar-scrollbar:before {
          background-color: #637381;
          opacity: 0.48;
        }
        .custom-scrollbar .simplebar-scrollbar.simplebar-visible:before {
          opacity: 1;
        }
        .custom-scrollbar .simplebar-mask {
          z-index: inherit;
        }
      `}</style>
      </div>
    );
  },
);

Scrollbar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default memo(Scrollbar);
