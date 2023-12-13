import React, { useEffect, useState } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

import "./Navbar.scss";
import { Link, Route, Routes } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Announcement from "../announcement/Announcement";
import Search from "./Search";
import { useCookies } from "react-cookie";
import { useRouter } from "../../../routes/hooks";
import { isExpired } from "react-jwt";
import Links from "../Links/Links";
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

  const dispatch = useDispatch();

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/v1/customers/logout");

      if (response.data.message === "Logout successful") {
        dispatch(logout({}));
        router.push("/")
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
    <div className="nav_container">
      <Announcement />
      <nav className="navbar">
        <div className="container">
          <div className="d-flex align-items-center">
            <Link to="/">
              <img className="img" src="/assets/logo.png" alt="logo" />
            </Link>
          </div>
          <div className="search">
            <Routes>
              <Route path="*" element={<Search />} />
            </Routes>
          </div>
          <div className="nav_links">
            <ul className="d-flex align-items-center">
              <li className="cart">
                <Link to="/cart">
                  <Iconify
                    icon="material-symbols-light:shopping-cart-outline-rounded"
                    width={32}
                    height={32}
                  />
                  <span>{cartItems?.length}</span>
                </Link>
              </li>
              {loading ? (
                <>
                  <Spinner animation="border" className="mt-2" />
                </>
              ) : (
                <>
                  {isTokenValid() && token && customer ? (
                    <>
                      <li>
                        <img
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                            border: "2px solid black",
                          }}
                          src={`http://localhost:3000/${customer?.customer_image}`}
                          alt={customer?.first_name + customer?.last_name}
                        />
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            dropdown ? setDropdown(false) : setDropdown(true);
                          }}
                        >
                          {customer?.first_name + " " + customer?.last_name}
                        </button>
                      </li>
                      {dropdown && (
                        <div className="dropdown">
                          <Link
                            to="/me"
                            onClick={(e) => {
                              e.preventDefault();
                              setDropdown(false);
                              router.push("/me");
                            }}
                          >
                            <Iconify
                              icon="material-symbols-light:supervised-user-circle-outline"
                              width={30}
                              height={30}
                            />
                            Profile
                          </Link>
                          <Link id="logout" onClick={logoutHandler}>
                            <Iconify
                              icon="material-symbols-light:logout-rounded"
                              width={30}
                              height={30}
                            />
                            Logout
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="app__navbar-menu">
            <Iconify
              icon="material-symbols-light:menu-rounded"
              width={28}
              height={28}
              onClick={() => setToggle(true)}
            />

            {toggle && (
              <motion.div
                whileInView={{ x: [300, 0] }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              >
                <Iconify
                  icon="material-symbols-light:cancel-outline-rounded"
                  width={28}
                  height={28}
                  onClick={() => setToggle(false)}
                />
                <ul>
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
          </div>
        </div>
      </nav>
      <div className="links">
        <Links />
      </div>
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
