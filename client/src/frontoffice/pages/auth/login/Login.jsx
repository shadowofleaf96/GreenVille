import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../../redux/frontoffice/customerSlice";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
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
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loginSuccessFlag, setLoginSuccessFlag] = useState(false);
  const axiosInstance = createAxiosInstance("customer")

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedRememberMe) {
      setRememberMe(JSON.parse(storedRememberMe));
    }
  }, []);

  useEffect(() => {
    if (loginSuccessFlag) {
      const redirect = searchParams.get("redirect");
      history(redirect || "/", { replace: true });
    }
  }, [loginSuccessFlag, searchParams, history]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRememberMeChange = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    localStorage.setItem("rememberMe", JSON.stringify(newRememberMe));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    dispatch(loginStart());

    try {
      const response = await axiosInstance.post("/customers/login", {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        localStorage.setItem('customer_access_token', response.data.access_token);
        localStorage.setItem('customer_refresh_token', response.data.refresh_token);

        dispatch(
          loginSuccess({
            customerToken: response.data.access_token,
            isLoggedIn: true
          })
        );
        setLoginSuccessFlag(true);
      }
    } catch (error) {
      toast.error("Error: " + error.response?.data?.message || "Login failed.");
    } finally {
      setLoadingSave(false);
    }
  };

  const responseMessage = (response) => {
    console.log(response);
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/customers/forgot-password", {
        email: enteredEmail,
      });

      toast.success(response.data.message);
      setOpenDialog(false);
    } catch (error) {
      console.error(error.message);
      toast.error("Error: " + error.response.data.message);
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
            maxWidth: "420px",
            backgroundColor: "white",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
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
                form: { autoComplete: "off" },
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

            <LoadingButton
              type="submit"
              fullWidth
              loading={loadingSave}
              variant="contained"
              sx={{ fontWeight: 500, fontSize: 15 }}
              className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
              loadingPosition="center"
            >
              {loadingSave ? 'Logging In...' : 'Login'}
            </LoadingButton>

            <GoogleLogin
              onSuccess={responseMessage}
              onError={errorMessage}
              width="340px"
              size="medium"
              shape="square"
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

    </div>
  );
};

export default Login;
