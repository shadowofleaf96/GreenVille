import React, { useEffect, useState, useRef } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Announcement from "../announcement/Announcement";
import Loader from "../loader/Loader";
import { logout, fetchCustomerProfile } from "../../../redux/frontoffice/customerSlice";

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
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <img className="w-24 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
          </Link>
          <div className="flex-grow">
            <div className="font-medium text-lg justify-center gap-8 hidden sm:hidden md:flex">
              <Link to="/" className={`hover:text-green-400 hover:underline ${isActive("/") ? "text-green-400" : "text-black"}`}>
                Home
              </Link>
              <Link to="/products" className={`hover:text-green-400 hover:underline ${isActive("/products") ? "text-green-400" : "text-black"}`}>
                Products
              </Link>
              <Link to="/contact" className={`hover:text-green-400 hover:underline ${isActive("/contact") ? "text-green-400" : "text-black"}`}>
                Contact
              </Link>
              <Link to="/about" className={`hover:text-green-400 hover:underline ${isActive("/about") ? "text-green-400" : "text-black"}`}>
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleSearchBar} className="cursor-pointer">
              <Iconify icon="material-symbols-light:search" width={32} height={32} />
            </button>
            <Link to="/cart" className="relative">
              <Iconify icon="mdi-light:cart" width={32} height={32} />
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
                    <button className="focus:outline-none" onClick={() => setDropdown(!dropdown)}>
                      <img className="h-12 w-12 rounded-full border-5 border-black" src={`${backend}/${customer.customer_image}`} alt={`${customer.first_name} ${customer.last_name}`} />
                    </button>
                    {dropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                        <Link to="/me" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400" onClick={() => setDropdown(false)}>
                          <Iconify className="m-2" icon="material-symbols-light:supervised-user-circle-outline" width={30} height={30} />
                          Profile
                        </Link>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-400 w-full text-left" onClick={logoutHandler}>
                          <Iconify className="mx-2" icon="material-symbols-light:logout-rounded" width={30} height={30} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="text-sm flex items-center space-x-4">
                    <Iconify icon="material-symbols-light:person-outline" width={42} height={42} />
                  </Link>
                )}
              </>
            )}
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
              <input
                type="text"
                placeholder="Search Products..."
                className="border-2 border-[#8DC63F]  rounded-md px-4 py-2 w-full bg-white focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e)}
                onFocus={() => setSearchDropdown(true)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Iconify icon="material-symbols-light:search" width={24} height={24} />
              </button>
              {searchDropdown && filteredProducts.length > 0 && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product.id}
                      className="flex items-center px-6 py-4 rounded text-black hover:bg-green-200"
                      onClick={handleSearchProductClick}
                    >
                      <img className="h-10 w-10" src={typeof product?.product_images === "string" ? `${backend}/${product?.product_images}` : `${backend}/${product?.product_images[0]}`}
                      />
                      {product.product_name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toggle && (
        <motion.div className="fixed top-0 right-0 bottom-0 w-1/3 bg-white shadow-md z-50 p-6" whileInView={{ x: [140, 0] }} transition={{ duration: 0.85, ease: "easeOut" }}>
          <div className="flex justify-end">
            <Iconify icon="material-symbols-light:cancel-outline-rounded" width={28} height={28} onClick={() => setToggle(false)} />
          </div>
          <ul className="list-none flex flex-col space-y-4 mt-6">
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
  );
};

export default Navbar;
