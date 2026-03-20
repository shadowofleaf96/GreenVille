import PropTypes from "prop-types";
import { useResponsive } from "@/admin/_hooks/use-responsive";
import { NAV, HEADER } from "../dashboard/config-layout";
import { motion } from "framer-motion";
import { premiumTransition } from "@/utils/animations";

const SPACING = 8;

export default function Main({ children, sx, ...other }) {
  const lgUp = useResponsive("up", "lg");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={premiumTransition}
      className={`
        grow min-h-screen flex flex-col
        transition-all duration-200
      `}
      style={{
        paddingTop: lgUp
          ? HEADER.H_DESKTOP + SPACING
          : HEADER.H_MOBILE + SPACING,
        paddingBottom: SPACING,
        paddingLeft: lgUp ? 16 : 0,
        paddingRight: lgUp ? 16 : 0,
        marginLeft: lgUp ? NAV.WIDTH : 0,
        width: "auto",
        ...sx,
      }}
      {...other}
    >
      {children}
    </motion.main>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
