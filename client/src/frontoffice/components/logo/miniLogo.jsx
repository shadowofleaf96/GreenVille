import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { RouterLink } from '../../../routes/components';

// ----------------------------------------------------------------------

const MiniLogo = forwardRef(({ disabledLink = true, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      component="img"
      src="/assets/logo.png"
      sx={{ width: 117, height: 88, cursor: 'pointer', ...sx }}
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

MiniLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default MiniLogo;
