import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fShortenNumber } from "../../utils/format-number";

export default function AppWidgetSummary({
  title,
  total,
  icon,
  currency,
  color = "transparent",
  sx,
  ...other
}) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 8,
        py: 2,
        backgroundColor: "transparent",
        boxShadow: "none",
        ...sx,
      }}
      {...other}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={2}
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ width: 72, height: 72 }}>{icon}</Box>

        <Stack spacing={0.5} sx={{ textAlign: "center" }}>
          <Typography variant="h5">
            {fShortenNumber(total)} {currency && ` ${currency}`}{" "}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
            {title}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  currency: PropTypes.string,
};
