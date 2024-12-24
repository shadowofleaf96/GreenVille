import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Iconify from "../../../backoffice/components/iconify";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Avatar } from "@mui/material";
const backend = import.meta.env.VITE_BACKEND_URL;


const ProfileLink = () => {
  const { customer, loading } = useSelector((state) => state.customers);

  const router = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation()

  const logoutHandler = async () => {
    try {
      localStorage.removeItem("customer_access_token");
      localStorage.removeItem("isAuthenticated");
      dispatch(logout());
      toast.success(t("You have been Logged out"));
      router("/");
    } catch (error) {
      toast.error(t("Error") + ": " + error.response.data.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="bg-white shadow-lg rounded-2xl p-2 md:p-4">
            <div className="text-center mt-3">
              {customer && (
                <Avatar
                  src={`${customer?.customer_image}`}
                  alt={customer?.first_name + customer?.last_name}
                  className="!h-36 !w-36 !rounded-full !border-4 !border-[#e8daff] !mx-auto"
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
                to="/profile"
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/profile")
                  ? "bg-[#8DC63F] text-white"
                  : "text-gray-600 hover:bg-[#8DC63F] hover:text-white"
                  }`}
              >
                <Iconify
                  icon="material-symbols-light:person-outline"
                  width={28}
                  height={28}
                  className="mr-3"
                />
                {t("My Profile")}
              </Link>
              <Link
                to="/profile/orders"
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/profile/orders")
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
                {t("My Orders")}
              </Link>
              <Link
                to="/profile/updateprofile"
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/profile/updateprofile")
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
                {t('updateCustomer')}
              </Link>
              <Link
                to="/profile/updateaddress"
                className={`flex items-center py-2 px-4 rounded-lg transition duration-300 ${isActive("/profile/updateaddress")
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
                {t('updateShippingAddress')}
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
                {t("Logout")}
              </button>
            </div>
          </div>
        </Fragment>
      )}

    </Fragment>
  );
};

export default ProfileLink;
