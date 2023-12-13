import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  setCustomer,
} from "../../../../redux/frontoffice/customerSlice";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Link as RouterLink } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "../../../../routes/hooks";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Logo from "../../../components/logo";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import "./Login.module.scss";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();


  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedRememberMe) {
      setRememberMe(JSON.parse(storedRememberMe));
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRememberMeChange = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);

    // Save the "Remember Me" state to local storage
    localStorage.setItem("rememberMe", JSON.stringify(newRememberMe));
  };
  const responseMessage = (response) => {
    // Handle the Google login response
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post("/v1/customers/login", {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        dispatch(
          loginSuccess({
            customer: response.data.customer,
            token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          })
        );
        router.push("/");
      }

      openSnackbar(response.data.message);
    } catch (error) {
      openSnackbar("Error: " + error.response.data.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/v1/customers/forgot-password", {
        email: enteredEmail,
      });

      // Handle the response (display a success message)
      console.log(response.data);
      setOpenDialog(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
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
          <Typography variant="h5" gutterBottom style={{ color: "black" }}>
            Welcome
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              autoComplete="chrome-off"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Email"
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Password"
              InputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      variant="body2"
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={handleOpenDialog}
                    >
                      Forgot?
                    </MuiLink>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  style={{ color: "#8dc63f" }}
                />
              }
              label="Remember Me"
            />
            <Button
              type="submit"
              style={{
                backgroundColor: "#8dc63f",
                color: "#fff",
                marginTop: "10px",
                marginBottom: "20px",
                borderRadius: "20px",
              }}
              fullWidth
            >
              Login
            </Button>
            <GoogleLogin
              onSuccess={responseMessage}
              onError={errorMessage}
              width="340px"
              size="medium"
              shape="circle"
              logo_alignment="center"
            />
            <Typography
              variant="body2"
              style={{ textAlign: "center", marginTop: "30px" }}
            >
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                style={{ color: "#8dc63f" }}
              >
                Register
              </Link>
            </Typography>
          </form>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent
              elevation={3}
              style={{
                padding: "40px",
                maxWidth: "300px",
                borderRadius: "20px",
              }}
            >
              <Typography>Enter your email to reset your password:</Typography>
              <form onSubmit={handleForgotPassword}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={enteredEmail}
                  onChange={(e) => setEnteredEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#8dc63f",
                    color: "#fff",
                    marginTop: "10px",
                    borderRadius: "20px",
                  }}
                  variant="contained"
                  fullWidth
                >
                  Submit
                </Button>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} style={{ color: "#8dc63f" }}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </motion.div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
