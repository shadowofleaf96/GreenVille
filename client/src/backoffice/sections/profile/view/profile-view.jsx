import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { admin } = useSelector((state) => state.adminAuth);
  const isActive = admin?.active;
  const color = isActive ? "primary" : "secondary";

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: "20px" }}>
        <Paper sx={{ padding: "24px", boxShadow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Avatar
                src={`${admin?.user_image}`}
                alt={`${admin?.first_name} ${admin?.last_name}`}
                sx={{
                  width: 220,
                  height: 220,
                  border: (theme) => `solid 4px ${theme.palette.primary.main}`,
                  marginBottom: 1,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {`${admin?.first_name.charAt(0).toUpperCase()}${admin?.last_name
                  .charAt(0)
                  .toUpperCase()}`}
              </Avatar>
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
              <Typography variant="h3" gutterBottom mb={4}>
                {t("Profile Information")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Full Name")}:</strong> {admin?.first_name} {admin?.last_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Email Address")}:</strong> {admin?.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Role")}:</strong> {admin?.role}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Username")}:</strong> {admin?.user_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Creation Date")}:</strong>{" "}
                    {new Date(admin?.creation_date).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>{t("Last Login")}:</strong>{" "}
                    {new Date(admin?.last_login).toLocaleString()}
                  </Typography>
                  <Badge
                    sx={{ mt: 5, minWidth: 24 }}
                    badgeContent={isActive ? t("Active") : t("Inactive")}
                    color={color}
                  ></Badge>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container >
  );
};

export default ProfilePage;
