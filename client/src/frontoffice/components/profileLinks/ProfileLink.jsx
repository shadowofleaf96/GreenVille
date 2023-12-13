import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import styles from "./ProfileLink.module.scss";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "../../../routes/hooks/";
import Alert from "@mui/material/Alert";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Iconify from "../../../backoffice/components/iconify"

const ProfileLink = () => {
  const { customer, loading } = useSelector((state) => state.customers);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const logoutHandler = async () => {
    try {
      const response = await axios.post("/v1/customers/logout");

      if (response.data.message === "Logout successful") {
        dispatch(logout({}));
        openSnackbar(response.data.message);
        router.push("/");
      } else {
        openSnackbar("Error: " + response.data.message);
      }
    } catch (error) {
      console.log(error);
      openSnackbar("Error: " + error.response.data.message);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className={styles.profile_links}>
            <div className="text-center mt-3">
              {customer && (
                <img
                  src={`http://localhost:3000/${customer?.customer_image}`}
                  alt={customer?.first_name + customer?.last_name}
                />
              )}

              <h4 className="mt-3">
                {customer?.first_name + " " + customer?.last_name}
              </h4>
              <p>{customer?.email}</p>
            </div>
            <hr className="text-primary" />

            <div className={`mt-3 ${styles.links}`}>
              <Link to="/me">
                <Iconify
                  icon="material-symbols-light:supervised-user-circle-outline"
                  width={28}
                  height={28}
                  className="me-3"
                />
                Profile
              </Link>
              <Link to="/me/update">
                <Iconify
                  icon="material-symbols-light:edit-rounded"
                  width={28}
                  height={28}
                  className="me-3"
                />
                Edit Profile
              </Link>
              <Link to="/orders/me">
                <Iconify
                  icon="material-symbols-light:orders-outline-rounded"
                  width={28}
                  height={28}
                  className="me-3"
                />
                My Order
              </Link>
              <button onClick={logoutHandler}>
                <Iconify
                  icon="material-symbols-light:logout-rounded"
                  width={28}
                  height={28}
                  className="me-3"
                />
                Logout
              </button>
            </div>
          </div>
        </Fragment>
      )}
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
    </Fragment>
  );
};

export default ProfileLink;
