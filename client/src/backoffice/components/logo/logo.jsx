import PropTypes from "prop-types";
import { forwardRef } from "react";

import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';

import Box from "@mui/material/Box";

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      component="img"
      src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5"
      sx={{ width: 213, height: 139, cursor: "pointer", ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link to="/admin" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
