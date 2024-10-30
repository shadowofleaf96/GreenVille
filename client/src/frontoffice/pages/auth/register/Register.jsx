import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import Logo from "../../../components/logo";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRouter } from "../../../../routes/hooks";
import { motion } from "framer-motion";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { LoadingButton } from "@mui/lab";

const RegistrationForm = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const axiosInstance = createAxiosInstance("customer");
  const [loadingSave, setLoadingSave] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingSave(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoadingSave(false);
      return;
    }

    try {
      const sanitizedFirstName = DOMPurify.sanitize(firstName);
      const sanitizedLastName = DOMPurify.sanitize(lastName);
      const sanitizedEmail = DOMPurify.sanitize(email);

      const formData = new FormData();
      formData.append("first_name", sanitizedFirstName);
      formData.append("last_name", sanitizedLastName);
      formData.append("email", sanitizedEmail);
      formData.append("password", password);

      if (profileImage) {
        formData.append("customer_image", profileImage);
      }

      const response = await axiosInstance.post("/customers", formData);

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
      if (response.status === 200) {
        setLoadingSave(false);
        toast.success(response?.data?.message);
        router.push("/login");
      }
    } catch (error) {
      setLoadingSave(false);
      toast.error("Error: " + error.response.data.error);
      console.log("Error Response:", error.response.data.error);
    }
  };

  return (
    <div className="backImage">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={3}
          sx={{ p: 5 }}
          style={{
            maxWidth: "640px",
            backgroundColor: "white",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <Typography
            variant="h5"
            gutterBottom
            style={{ textAlign: "center", color: "black" }}
          >
            {t("CreateAccount")}
          </Typography>
          <form onSubmit={handleRegister}>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <TextField
                label={t("FirstName")}
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(DOMPurify.sanitize(e.target.value))}
                InputLabelProps={{ shrink: true }}
                placeholder={t("FirstName")}
              />
              <TextField
                label={t("LastName")}
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(DOMPurify.sanitize(e.target.value))}
                InputLabelProps={{ shrink: true }}
                placeholder={t("LastName")}
              />
            </Box>
            <TextField
              label={t("Email")}
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(DOMPurify.sanitize(e.target.value))}
              InputLabelProps={{ shrink: true }}
              placeholder={t("Email")}
            />
            <Box sx={{ display: "flex", gap: "16px" }}>
              <TextField
                label={t("Password")}
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                placeholder={t("Password")}
              />
              <TextField
                label={t("ConfirmPassword")}
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                placeholder={t("ConfirmPassword")}
              />
            </Box>
            <LoadingButton
              type="submit"
              fullWidth
              loading={loadingSave}
              variant="contained"
              sx={{ fontWeight: 500, fontSize: 15 }}
              className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
            >
              {loadingSave ? t("Registering") : t("Register")}
            </LoadingButton>
            <Typography
              variant="body2"
              style={{
                textAlign: "center",
                marginTop: "20px",
                marginRight: "10px",
              }}
            >
              {t("AlreadyHaveAccount")}{" "}
              <Link to="/login" style={{ color: "#8dc63f" }}>
                {t("Login")}
              </Link>
            </Typography>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
