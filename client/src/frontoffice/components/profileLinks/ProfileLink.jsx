import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/frontoffice/customerSlice";
import Iconify from "../../../backoffice/components/iconify";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ProfileLink = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customers);

  const logoutHandler = async () => {
    try {
      localStorage.removeItem("customer_access_token");
      localStorage.removeItem("isAuthenticated");
      dispatch(logout());
      if (window.AndroidInterface) {
        window.AndroidInterface.onLogout();
      }
      toast.success(t("You have been Logged out"));
      navigate("/");
    } catch (error) {
      toast.error(
        t("Error") + ": " + (error.response?.data?.message || error.message),
      );
    }
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    {
      to: "/profile",
      label: t("My Profile"),
      icon: "solar:user-bold-duotone",
      active: isActive("/profile"),
    },
    {
      to: "/profile/orders",
      label: t("My Orders"),
      icon: "solar:bag-heart-bold-duotone",
      active: isActive("/profile/orders"),
    },
    {
      to: "/profile/updateprofile",
      label: t("updateCustomer"),
      icon: "solar:settings-bold-duotone",
      active: isActive("/profile/updateprofile"),
    },
    {
      to: "/profile/updateaddress",
      label: t("updateShippingAddress"),
      icon: "solar:map-point-bold-duotone",
      active: isActive("/profile/updateaddress"),
    },
  ];

  return (
    <div className="bg-white rounded-4xl sm:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden lg:sticky lg:top-32">
      {/* User header in sidebar */}
      <div className="p-6 sm:p-8 pb-4 text-center">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 animate-pulse" />
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl relative z-10">
            <AvatarImage
              src={customer?.customer_image}
              alt={`${customer?.first_name} ${customer?.last_name}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-white font-black text-xl">
              {customer?.first_name?.charAt(0)}
              {customer?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-gray-900 line-clamp-1 uppercase tracking-tight">
            {customer?.first_name} {customer?.last_name}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 italic">
            {customer?.email}
          </p>
        </div>
      </div>

      <div className="px-4 pb-8 pt-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`group relative flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 ${
              link.active
                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                : "text-gray-500 hover:bg-gray-50 hover:text-primary"
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-colors ${
                link.active
                  ? "bg-white/20"
                  : "bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              <Iconify icon={link.icon} width={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">
              {link.label}
            </span>
            {link.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            )}
          </Link>
        ))}

        <Separator className="my-6 bg-gray-50" />

        <button
          onClick={logoutHandler}
          className="w-full group flex items-center gap-4 py-4 px-6 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 border-none bg-transparent"
        >
          <div className="p-2 rounded-xl bg-red-50 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
            <Iconify icon="solar:logout-bold-duotone" width={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            {t("Logout")}
          </span>
        </button>
      </div>

      {/* Trust Badge Small */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-center gap-4">
        <Iconify
          icon="solar:shield-check-bold"
          width={16}
          className="text-green-500"
        />
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
          {t("Certified Selection")}
        </p>
      </div>
    </div>
  );
};

export default ProfileLink;
