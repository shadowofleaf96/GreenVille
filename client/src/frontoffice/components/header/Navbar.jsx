import React, { useEffect, useState } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Announcement from "../announcement/Announcement";
import { useCookies } from "react-cookie";
import { useRouter } from "../../../routes/hooks";
import { isExpired } from "react-jwt";

const SECRETKEY = import.meta.env.VITE_SECRETKEY;

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { customer, token, loading } = useSelector((state) => state.customers);
  const [cookies] = useCookies(["customer_access_token"]);
  const tokenCookies = cookies.customer_access_token;
  const { cartItems } = useSelector((state) => state.carts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const isSticky = (e) => {
    const header = document.querySelector(".links");
    const scrollTop = window.scrollY;
    scrollTop >= 150
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/v1/customers/logout");

      if (response.data.message === "Logout successful") {
        dispatch(logout({}));
        router.push("/");
        openSnackbar(response.data.message);
      } else {
        openSnackbar("Error: " + response.data.message);
      }
    } catch (error) {
      openSnackbar("Error: " + error.response.data.message);
    }
  };

  const isTokenValid = () => {
    if (tokenCookies) {
      try {
        return !isExpired(tokenCookies, SECRETKEY);
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  return (
    <div className="relative">
      <Announcement />
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/">
            <img className="w-24 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
          </Link>
          <div className="flex-grow">
            <div className="flex font-semibold text-lg justify-center gap-8 ">
              <Link to="/" className="hover:text-green-400">Home </Link>
              <Link to="/products" className="hover:text-green-400">Products </Link>
              <Link to="/contact" className="hover:text-green-400">Contact </Link>
              <Link to="/about" className="hover:text-green-400">About </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Iconify
                icon="material-symbols-light:shopping-cart-outline-rounded"
                width={32}
                height={32}
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartItems?.length}
              </span>
            </Link>
            {loading ? (
              <Spinner className="mt-2" />
            ) : (
              <>
                {isTokenValid() && token && customer ? (
                  <>
                    <div className="relative">
                      <button
                        className="focus:outline-none"
                        onClick={() => setDropdown(!dropdown)}
                      >
                        <img
                          className="h-12 w-12 rounded-full border-5 border-black"
                          src={`http://localhost:3000/${customer?.customer_image}`}
                          alt={customer?.first_name + customer?.last_name}
                        />
                      </button>
                      {dropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                          <Link
                            to="/me"
                            className="flex items-center px-4 py-2 text-sm text-black hover:text-green-400"
                            onClick={(e) => {
                              e.preventDefault();
                              setDropdown(false);
                              router.push("/me");
                            }}
                          >
                            <Iconify
                              className="mx-2"
                              icon="material-symbols-light:supervised-user-circle-outline"
                              width={30}
                              height={30}
                            />{" "}
                            Profile
                          </Link>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-black hover:text-green-400 w-full text-left"
                            onClick={logoutHandler}
                          >
                            <Iconify
                              className="mx-2"
                              icon="material-symbols-light:logout-rounded"
                              width={30}
                              height={30}
                            />{" "}
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to="/login" className="text-sm">
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Iconify
              icon="material-symbols-light:menu-rounded"
              width={28}
              height={28}
              onClick={() => setToggle(true)}
            />
          </div>
        </div>
      </nav>

      {toggle && (
        <motion.div
          className="fixed top-0 right-0 bottom-0 w-2/3 bg-white shadow-md z-50 p-6"
          whileInView={{ x: [300, 0] }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <div className="flex justify-end">
            <Iconify
              icon="material-symbols-light:cancel-outline-rounded"
              width={28}
              height={28}
              onClick={() => setToggle(false)}
            />
          </div>
          <ul className="mt-8 space-y-4">
            <li>
              <Link to="/" onClick={() => setToggle(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setToggle(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setToggle(false)}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setToggle(false)}>
                About
              </Link>
            </li>
          </ul>
        </motion.div>
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
    </div>
  );
};

export default Navbar;
