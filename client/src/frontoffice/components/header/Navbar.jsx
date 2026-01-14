import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useProducts } from "../../../services/api/product.queries";

import Iconify from "../../../backoffice/components/iconify";
import Announcement from "../announcement/Announcement";
import LazyImage from "../../../components/lazyimage/LazyImage";
import optimizeImage from "../../components/optimizeImage";
import LanguagePopover from "../../../backoffice/layouts/dashboard/common/language-popover";

import {
  logout,
  fetchCustomerProfile,
} from "../../../redux/frontoffice/customerSlice";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { customer, isLoading } = useSelector((state) => state.customers);
  const { cartCount } = useSelector((state) => state.carts);
  const { t, i18n } = useTranslation();
  const [isWebView, setIsWebView] = useState(false);
  const currentLanguage = i18n.language;

  // Fetch all products for search functionality
  const { data: productsData } = useProducts({ limit: 1000, status: "true" });
  const products = productsData?.data || [];

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customer_access_token");
    if (!customer && token) {
      dispatch(fetchCustomerProfile());
    }
  }, [dispatch, customer]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes("GreenVille")) {
      setIsWebView(true);
    }
  }, []);

  const logoutHandler = async () => {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("isAuthenticated");
    dispatch(logout());
    toast.success(t("You have been Logged out"));
    navigate("/");
  };

  const handleSearchProductClick = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
    setFilteredProducts([]);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = products.filter((product) =>
        product.product_name[currentLanguage]
          ?.toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const { data: settings } = useSelector((state) => state.adminSettings);
  const logoUrl =
    settings?.logo_url ||
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5";

  const navLinks = [
    { name: t("Home"), path: "/" },
    { name: t("Products"), path: "/products" },
    { name: t("Contact"), path: "/contact" },
    { name: t("About"), path: "/about" },
  ];

  return (
    <div className="fixed w-full z-50">
      <Announcement />

      <nav className="bg-white/95 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-20 sm:h-24 md:h-28 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="shrink-0 transition-transform hover:scale-105 duration-300"
          >
            <LazyImage
              className="w-24 sm:w-28 md:w-36 h-auto"
              src={logoUrl}
              alt="logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8 space-x-12 px-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-black tracking-widest uppercase transition-colors group ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
                    isActive(link.path)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 ${
                isSearchVisible ? "bg-primary/10 text-primary" : "text-gray-600"
              }`}
            >
              <Iconify
                icon={
                  isSearchVisible
                    ? "solar:close-circle-bold-duotone"
                    : "solar:magnifer-linear"
                }
                width={20}
                className="sm:w-6 sm:h-6"
              />
            </Button>

            {/* Cart Icon */}
            {!isWebView && (
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 text-gray-600"
                >
                  <Iconify
                    icon="solar:cart-large-2-linear"
                    width={20}
                    className="sm:w-6 sm:h-6"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-black w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg pulse-animation">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Profile Dropdown */}
            {!isWebView && (
              <>
                {isLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                ) : customer ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-12 w-12 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 group"
                      >
                        <Avatar className="h-full w-full group-hover:scale-110 transition-transform duration-500">
                          <AvatarImage
                            src={customer.customer_image}
                            alt={customer.first_name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                            {customer.first_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 mt-2 p-2 rounded-2xl border-none shadow-2xl bg-white"
                    >
                      <DropdownMenuLabel className="p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-black text-gray-900 leading-none">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs font-medium text-gray-500 truncate">
                            {customer.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-100 mx-2" />
                      <DropdownMenuItem
                        asChild
                        className="p-3 cursor-pointer rounded-xl group focus:bg-primary/10 focus:text-primary transition-colors"
                      >
                        <Link to="/profile" className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <Iconify
                              icon="solar:user-bold-duotone"
                              width={20}
                            />
                          </div>
                          <span className="font-bold text-sm tracking-wide">
                            {t("My Profile")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={logoutHandler}
                        className="p-3 cursor-pointer rounded-xl group focus:bg-red-50 focus:text-red-500 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors text-red-500">
                            <Iconify
                              icon="solar:logout-3-bold-duotone"
                              width={20}
                            />
                          </div>
                          <span className="font-bold text-sm tracking-wide">
                            {t("Logout")}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 text-gray-600 w-12 h-16"
                    >
                      <Iconify icon="solar:user-circle-linear" width={24} />
                    </Button>
                  </Link>
                )}
              </>
            )}
            {/* Language Selection */}
            <LanguagePopover />

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full hover:bg-gray-100"
                >
                  <Iconify icon="solar:hamburger-menu-linear" width={28} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-75 sm:w-100 border-none shadow-2xl p-0"
              >
                <SheetHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl font-black text-primary tracking-tight uppercase">
                    {t("Menu")}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2 p-8 pt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all group ${
                        isActive(link.path)
                          ? "bg-primary/10 text-primary font-black"
                          : "text-gray-500 hover:bg-gray-50 font-bold hover:text-gray-900"
                      }`}
                    >
                      <span className="uppercase tracking-widest text-sm">
                        {link.name}
                      </span>
                      <Iconify
                        icon="solar:arrow-right-linear"
                        width={20}
                        className={`transition-transform duration-300 ${
                          isActive(link.path)
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </Link>
                  ))}
                </div>

                <div className="absolute bottom-10 left-0 w-full px-8 space-y-6">
                  <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {t("Follow Us")}
                    </span>
                    <div className="flex gap-2">
                      <Iconify
                        icon="solar:share-circle-bold-duotone"
                        className="text-primary cursor-pointer hover:scale-110 transition-transform"
                        width={24}
                      />
                      <Iconify
                        icon="solar:heart-bold-duotone"
                        className="text-primary cursor-pointer hover:scale-110 transition-transform"
                        width={24}
                      />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Modern Search Overlay */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-b border-gray-100 overflow-hidden z-49 animate-in slide-in-from-top-4 duration-300"
          >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                  <Iconify icon="solar:magnifer-bold-duotone" width={28} />
                </div>
                <Input
                  autoFocus
                  placeholder={t("Search for premium products...")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="h-14 w-full pl-16 pr-8 text-xl font-bold bg-gray-50/50 border-none rounded-3xl focus-visible:ring-primary/20 transition-all shadow-inner"
                />
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="mt-8 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 px-4 italic">
                    {filteredProducts.length > 0
                      ? t("Found Results")
                      : t("No results found")}
                  </h4>
                  <div className="grid gap-2 max-h-[60vh] overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={handleSearchProductClick}
                        className="flex items-center p-4 rounded-2xl bg-white border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-white group-hover:scale-105 transition-transform duration-500">
                          <LazyImage
                            src={
                              typeof product?.product_images === "string"
                                ? optimizeImage(product.product_images, 80)
                                : optimizeImage(product.product_images[0], 80)
                            }
                            className="w-full h-full object-cover"
                            alt={product.product_name[currentLanguage]}
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <p className="font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {product.product_name[currentLanguage]}
                          </p>
                          <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mt-1">
                            {product.price} {t("DH")}
                          </p>
                        </div>
                        <Iconify
                          icon="solar:arrow-right-up-bold-duotone"
                          className="text-gray-300 group-hover:text-primary transition-colors"
                          width={24}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
