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
            src="../../../../assets/illustrations/illustration_404.png"
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
            className="mt-4 mb-4 text-white flex justify-center rounded-lg text-md font-medium normal-case shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
            component={RouterLink}
          >
            {t("Home")}
          </Button>
        </Box>
      </Container>
    </>
  );
}
