import React, { useState } from "react";
import { setCustomer } from "../../../../redux/frontoffice/customerSlice";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Logo from "../../../components/logo";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRouter } from "../../../../routes/hooks";
import { motion } from "framer-motion";
import "./Register.module.scss";

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("password", password);

      if (profileImage) {
        formData.append("customer_image", profileImage);
      }

      const response = await axios.post(
        "http://localhost:3000/v1/customers/",
        formData
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      if (response.status === 200) {
          router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };
  return (
    <div className="backImage">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 5 }}
          style={{
            maxWidth: "420px",
            backdropFilter: "blur(90px)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Logo sx={{ marginBottom: "20px" }} />
          <Typography
            variant="h5"
            gutterBottom
            style={{ textAlign: "center", color: "black" }}
          >
            Create an account
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="First Name"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Last Name"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Email"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Password"
            />
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#8dc63f",
                color: "#fff",
                marginTop: "10px",
                borderRadius: "20px",
              }}
              fullWidth
            >
              Register
            </Button>
            <Typography
              variant="body2"
              style={{ textAlign: "center", marginTop: "20px", marginRight: "10px" }}
            >
              Already have an account?{" "}
               <Link to="/login" style={{ color: "#8dc63f" }}>
                 Login
              </Link>
            </Typography>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
