import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "../../../routes/hooks/";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Iconify from "../../../backoffice/components/iconify";

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
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <div className="text-center mt-3">
              {customer && (
                <img
                  src={`http://localhost:3000/${customer?.customer_image}`}
                  alt={customer?.first_name + customer?.last_name}
                  className="h-36 w-36 rounded-full border-4 border-[#e8daff] mx-auto"
                />
              )}

              <h4 className="mt-3 text-xl font-medium tracking-wide">
                {customer?.first_name + " " + customer?.last_name}
              </h4>
              <p className="text-gray-600">{customer?.email}</p>
            </div>
            <hr className="my-4 border-t border-gray-200" />

            <div className="flex flex-col mt-3">
              <Link
                to="/me"
                className="flex items-center text-gray-600 py-2 px-4 rounded-lg hover:bg-[#8DC63F] hover:text-white transition duration-300"
              >
                <Iconify
                  icon="material-symbols-light:supervised-user-circle-outline"
                  width={28}
                  height={28}
                  className="mr-3"
                />
                Profile
              </Link>
              <Link
                to="/me/update"
                className="flex items-center text-gray-600 py-2 px-4 rounded-lg hover:bg-[#8DC63F] hover:text-white transition duration-300"
              >
                <Iconify
                  icon="material-symbols-light:edit-rounded"
                  width={28}
                  height={28}
                  className="mr-3"
                />
                Edit Profile
              </Link>
              <Link
                to="/orders/me"
                className="flex items-center text-gray-600 py-2 px-4 rounded-lg hover:bg-[#8DC63F] hover:text-white transition duration-300"
              >
                <Iconify
                  icon="material-symbols-light:orders-outline-rounded"
                  width={28}
                  height={28}
                  className="mr-3"
                />
                My Order
              </Link>
              <button
                onClick={logoutHandler}
                className="flex items-center text-gray-600 py-2 px-4 rounded-lg hover:bg-[#8DC63F] hover:text-white transition duration-300 border-none bg-white text-start"
              >
                <Iconify
                  icon="material-symbols-light:logout-rounded"
                  width={28}
                  height={28}
                  className="mr-3"
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
