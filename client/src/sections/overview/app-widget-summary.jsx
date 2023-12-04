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
  color = "primary",
  sx,
  ...other
}) {
  return (
    <Card
      component={Stack}
      spacing={3}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        height: 150,
        borderRadius: 2,
        backgroundColor: "white",
        ...sx,
        "&:hover": {
          transform: "scale(1.1)",
          transition: "transform ease-in-out 0.2s", // Optional: Add smoother transition
        },
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={1}
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ width: 72, height: 72 }}>{icon}</Box>

        <Stack sx={{ textAlign: "center" }}>
          <Typography variant="h5">
            {fShortenNumber(total)} {currency && ` ${currency}`}
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
