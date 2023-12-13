import PropTypes from "prop-types";
import { forwardRef } from "react";

import { useTheme } from "@mui/material/styles";

import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { RouterLink } from "../../routes/components";

// ----------------------------------------------------------------------

const NavLogo = forwardRef(({ disabledLink = true, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      component="img"
      src="/assets/nav_logo.png"
      sx={{ width: 32, height: 37, cursor: "pointer", ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Box>
    {logo}
  </Box>
  );
});

NavLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default NavLogo;
