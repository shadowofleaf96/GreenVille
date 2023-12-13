import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { RouterLink } from "../../../routes/components";

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: "auto",
            display: "flex",
            minHeight: "100vh",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/assets/illustrations/illustration_404.png"
            sx={{
              mx: "auto",
              height: "auto",
            }}
          />

          <Typography variant="h3" sx={{ mb: 5 }}>
            {t("Sorry, page not found!")}
          </Typography>

          <Button
            href="/"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            {t("Go to Home")}
          </Button>
        </Box>
      </Container>
    </>
  );
}
