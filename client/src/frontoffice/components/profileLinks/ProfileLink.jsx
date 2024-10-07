import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import Loader from "../loader/Loader";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "../../../routes/hooks/";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Iconify from "../../../backoffice/components/iconify";
const backend = import.meta.env.VITE_BACKEND_URL;


const ProfileLink = () => {
  const { customer, loading } = useSelector((state) => state.customers);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      localStorage.removeItem("customer_access_token");
      dispatch(logout());
      toast.success("You have been Logged out");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error.response.data.message);
    }
  };

  const isActive = (path) => location.pathname === path;

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
                  src={`${backend}/${customer?.customer_image}`}
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

            <div className="flex flex-col mt-4 gap-3">
              <Link
                to="/me"
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/me")
                    ? "bg-[#8DC63F] text-white"
                    : "text-gray-600 hover:bg-[#8DC63F] hover:text-white"
                  }`}
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
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/me/update")
                    ? "bg-[#8DC63F] text-white"
                    : "text-gray-600 hover:bg-[#8DC63F] hover:text-white"
                  }`}
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
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/orders/me")
                    ? "bg-[#8DC63F] text-white"
                    : "text-gray-600 hover:bg-[#8DC63F] hover:text-white"
                  }`}
              >
                <Iconify
                  icon="material-symbols-light:orders-outline-rounded"
                  width={28}
                  height={28}
                  className="mr-3"
                />
                My Orders
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
     
    </Fragment>
  );
};

export default ProfileLink;
