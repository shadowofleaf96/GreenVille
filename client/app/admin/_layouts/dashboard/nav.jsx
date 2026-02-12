"use client";

import { useEffect } from "react";
import PropTypes from "prop-types";
import { fetchUserProfile } from "@/store/slices/admin/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/admin/_hooks/use-responsive";
import MiniLogo from "@/admin/_components/logo/miniLogo";
import Scrollbar from "@/admin/_components/scrollbar";
import { NAV } from "../dashboard/config-layout";
import useNavConfig from "../dashboard/config-navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { admin } = useSelector((state) => state.adminAuth);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const currentLang = i18n.language;

  useEffect(() => {
    if (!admin) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const navConfig = useNavConfig();

  const renderAccount = (
    <div className="mx-6 py-8 flex flex-col items-center justify-center space-y-4">
      <Avatar className="w-24 h-24 border-4 border-primary/10 shadow-xl scale-110">
        <AvatarImage
          src={admin?.user_image}
          alt="Avatar"
          className="object-cover"
        />
        <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
          {admin?.first_name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
          {t("yourAccount")}
        </p>
        <p className="text-base font-bold text-gray-900 tracking-tight">
          {admin?.first_name + " " + admin?.last_name}
        </p>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 capitalize tracking-wide">
          {admin?.role}
        </div>
      </div>
    </div>
  );

  const renderMenu = (
    <nav className="grow px-4 space-y-2 overflow-y-auto scrollbar-hide">
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </nav>
  );

  const renderContent = (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="mt-8 flex justify-center mb-4">
        <MiniLogo />
      </div>

      <Scrollbar className="h-full">
        {renderAccount}
        {renderMenu}
      </Scrollbar>

      <div className="p-6">
        <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">
            {settings?.website_title?.[currentLang] || "GreenVille"}
          </p>
        </div>
      </div>
    </div>
  );

  if (upLg) {
    return (
      <aside
        className="fixed left-0 top-0 bottom-0 bg-white border-r border-dashed border-gray-200 z-10"
        style={{ width: NAV.WIDTH }}
      >
        {renderContent}
      </aside>
    );
  }

  return (
    <Sheet open={openNav} onOpenChange={onCloseNav}>
      <SheetContent side="left" className="p-0 w-70 border-none">
        {renderContent}
      </SheetContent>
    </Sheet>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  return (
    <Link
      href={item.path}
      className={`
        flex items-center min-h-11 px-4 rounded-lg
        transition-all duration-200 group
        ${
          active
            ? "bg-primary/10 text-primary font-semibold"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium"
        }
      `}
    >
      <div
        className={`w-6 h-6 mr-4 flex items-center justify-center transition-colors ${
          active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
        }`}
      >
        {item.icon}
      </div>

      <span className="text-sm capitalize grow">{item.title}</span>
    </Link>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
