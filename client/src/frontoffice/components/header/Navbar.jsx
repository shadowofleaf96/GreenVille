import React, { useEffect, useState, useRef } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Announcement from "../announcement/Announcement";
import Loader from "../loader/Loader";
import { Avatar } from "@mui/material";
import optimizeImage from "../../components/optimizeImage"
import { logout, fetchCustomerProfile } from "../../../redux/frontoffice/customerSlice";
import LanguagePopover from "../../../backoffice/layouts/dashboard/common/language-popover";
import { useTranslation } from "react-i18next";

const backend = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { customer, isLoading } = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.carts);
  const { t, i18n } = useTranslation();
  const [isWebView, setIsWebView] = useState(false);
  const currentLanguage = i18n.language

  const location = useLocation();
  const dispatch = useDispatch();
  const router = useNavigate()

  useEffect(() => {
    if (!customer) {
      dispatch(fetchCustomerProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes("GreenVille")) {
      setIsWebView(true);
    }
  }, []);

  const totalQuantity = cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  const logoutHandler = async () => {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("isAuthenticated");
    dispatch(logout());
    toast.success(t("You have been Logged out"));
    router("/");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  };

  const handleSearchProductClick = () => {
    setSearchDropdown(false);
    setIsSearchVisible(false)
    setSearchQuery("");
    setFilteredProducts([]);
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


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    const results = products.filter((product) =>
      product.product_name[currentLanguage].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="fixed w-full z-50">
      <Announcement />
      <nav className="bg-white shadow-lg py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/">
            <img className="w-24 h-auto bg-cover" src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5" alt="logo" />
          </Link>
          <div className="flex-grow">
            <div className="font-medium text-lg justify-center gap-8 hidden sm:hidden md:flex">
              <Link to="/" className={`hover:text-green-400 hover:underline ${isActive("/") ? "text-green-400" : "text-black"}`}>
                {t("Home")}
              </Link>
              <Link to="/products" className={`hover:text-green-400 hover:underline ${isActive("/products") ? "text-green-400" : "text-black"}`}>
                {t("Products")}
              </Link>
              <Link to="/contact" className={`hover:text-green-400 hover:underline ${isActive("/contact") ? "text-green-400" : "text-black"}`}>
                {t("Contact")}
              </Link>
              <Link to="/about" className={`hover:text-green-400 hover:underline ${isActive("/about") ? "text-green-400" : "text-black"}`}>
                {t("About")}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleSearchBar} className="cursor-pointer rtl:ml-3">
              <Iconify icon="material-symbols-light:search" width={32} height={32} />
            </button>
            {!isWebView && (
              <Link to="/cart" className="relative">
                <Iconify icon="mdi-light:cart" width={32} height={32} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-light w-4 max-w-4 flex flex-grow justify-center rounded-full text-xs">
                  {totalQuantity}
                </span>
              </Link>
            )}
            {isLoading ? (
              <Loader className="mt-2" />
            ) : (
              <>
                {customer ? (
                  !isWebView && (
                    <div className="relative" ref={dropdownRef}>
                      <button className="focus:outline-none" onClick={() => setDropdown(!dropdown)}>
                        <Avatar className="h-12 w-12 rounded-full border-5 border-black" src={`${customer.customer_image}`} alt={`${customer.first_name} ${customer.last_name}`} />
                      </button>
                      {dropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400"
                            onClick={() => setDropdown(false)}
                          >
                            <Iconify className="m-2" icon="material-symbols-light:supervised-user-circle-outline" width={30} height={30} />
                            {t("Profile")}
                          </Link>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400 w-full text-left"
                            onClick={logoutHandler}
                          >
                            <Iconify className="mx-2" icon="material-symbols-light:logout-rounded" width={30} height={30} />
                            {t("Logout")}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  !isWebView && ( 
                    <Link to="/login" className="text-sm flex items-center space-x-4">
                      <Iconify icon="material-symbols-light:person-outline" width={42} height={42} />
                    </Link>
                  )
                )}
              </>
            )}
            <LanguagePopover />
          </div>
          <div className="md:hidden flex items-center ml-4">
            <Iconify icon="material-symbols-light:menu-rounded" width={28} height={28} onClick={() => setToggle(true)} />
          </div>
        </div>
      </nav>

      {isSearchVisible && (
        <div className="bg-gray-100 py-4 px-4 shadow-md">
          <div className="container mx-auto flex items-center justify-center">
            <div className="relative w-full">
              <div>
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <Iconify icon="material-symbols-light:search" width={24} height={24} />
                </button>
                <input
                  type="text"
                  placeholder={t("Search for Products...")}
                  className="border-2 border-[#8DC63F] rounded-md px-4 py-2 w-full bg-white focus:outline-none transition-all pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e)}
                  onFocus={() => setSearchDropdown(true)}
                />
              </div>
              {searchDropdown && filteredProducts.length > 0 && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product.id}
                      className="flex items-center px-6 py-4 rounded text-black hover:bg-green-200"
                      onClick={handleSearchProductClick}
                    >
                      <img className="h-10 w-10" src={typeof product?.product_images === "string" ? `${optimizeImage(product?.product_images, 60)}` : `${optimizeImage(product?.product_images[0], 60)}`}
                      />
                      {product.product_name[currentLanguage]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toggle && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-60 z-100"
            onClick={() => setToggle(false)}
          />

          <motion.div
            className="fixed top-0 right-0 bottom-0 w-1/3 bg-white shadow-md z-100 p-6"
            whileInView={{ x: [100, 0] }}
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
            <ul className="list-none flex flex-col space-y-4 mt-6">
              <li>
                <Link to="/" onClick={() => setToggle(false)} className={`hover:text-green-400 hover:underline ${isActive("/") ? "text-green-400" : "text-black"}`}>
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setToggle(false)} className={`hover:text-green-400 hover:underline ${isActive("/products") ? "text-green-400" : "text-black"}`}>
                  {t("Products")}
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setToggle(false)} className={`hover:text-green-400 hover:underline ${isActive("/contact") ? "text-green-400" : "text-black"}`}>
                  {t("Contact")}
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setToggle(false)} className={`hover:text-green-400 hover:underline ${isActive("/about") ? "text-green-400" : "text-black"}`}>
                  {t("About")}
                </Link>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Navbar;
