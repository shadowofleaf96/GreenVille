import React, { useEffect, useState, useRef } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { logout, fetchCustomerProfile } from "../../../redux/frontoffice/customerSlice";
import Announcement from "../announcement/Announcement";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
const backend = import.meta.env.VITE_BACKEND_URL;


const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { customer, isLoading } = useSelector((state) => state.customers);
  const { cartItems } = useSelector((state) => state.carts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!customer) {
      dispatch(fetchCustomerProfile());
    }
  }, [dispatch]);

  const totalQuantity = cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  const logoutHandler = async () => {
    localStorage.removeItem("customer_access_token");
    dispatch(logout());
    toast.success("You have been Logged out");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed w-full z-50">
      <Announcement />
      <nav className="bg-white shadow-lg py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/">
            <img className="w-24 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
          </Link>
          <div className="flex-grow">
            <div className="font-medium text-lg justify-center gap-8 hidden sm:hidden md:flex">
              <Link
                to="/"
                className={`hover:text-green-400 hover:underline ${isActive("/") ? "text-green-400" : "text-black"}`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`hover:text-green-400 hover:underline ${isActive("/products") ? "text-green-400" : "text-black"}`}
              >
                Products
              </Link>
              <Link
                to="/contact"
                className={`hover:text-green-400 hover:underline ${isActive("/contact") ? "text-green-400" : "text-black"}`}
              >
                Contact
              </Link>
              <Link
                to="/about"
                className={`hover:text-green-400 hover:underline ${isActive("/about") ? "text-green-400" : "text-black"}`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Iconify
                icon="mdi-light:cart"
                width={32}
                height={32}
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-light w-4 max-w-4 flex flex-grow justify-center rounded-full text-xs">
                {totalQuantity}
              </span>
            </Link>
            {isLoading ? (
              <Loader className="mt-2" />
            ) : (
              <>
                {customer ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="focus:outline-none"
                      onClick={() => setDropdown(!dropdown)}
                    >
                      <img
                        className="h-12 w-12 rounded-full border-5 border-black"
                        src={`${backend}/${customer.customer_image}`}
                        alt={`${customer.first_name} ${customer.last_name}`}
                      />
                    </button>
                    {dropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                        <Link
                          to="/me"
                          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400"
                          onClick={() => setDropdown(false)}
                        >
                          <Iconify
                            className="m-2"
                            icon="material-symbols-light:supervised-user-circle-outline"
                            width={30}
                            height={30}
                          />
                          Profile
                        </Link>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400 w-full text-left"
                          onClick={logoutHandler}
                        >
                          <Iconify
                            className="mx-2"
                            icon="material-symbols-light:logout-rounded"
                            width={30}
                            height={30}
                          />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="text-sm flex items-center space-x-4">
                    <Iconify
                      icon="material-symbols-light:person-outline"
                      width={42}
                      height={42}
                    />
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="md:hidden flex items-center ml-4">
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
        <>
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-1/3 bg-white shadow-md z-50 p-6"
            whileInView={{ x: [140, 0] }}
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

          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setToggle(false)}
          ></div>
        </>
      )}


    </div>
  );
};

export default Navbar;
