"use client";

import PropTypes from "prop-types";
import { useResponsive } from "@/admin/_hooks/use-responsive";
import Iconify from "@/components/shared/iconify";
import { NAV, HEADER } from "./config-layout";
import AccountPopover from "./common/account-popover";
import LanguagePopover from "./common/language-popover";
import NotificationsPopover from "./common/notifications-popover";
import { useTranslation } from "react-i18next";

export default function Header({ onOpenNav }) {
  const lgUp = useResponsive("up", "lg");
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <header
      className={`
        fixed top-0 z-40 flex items-center
        transition-all duration-200
        bg-white/95 shadow-sm
        border-b border-dashed border-gray-200
      `}
      style={{
        height: lgUp ? HEADER.H_DESKTOP : HEADER.H_MOBILE,
        width: lgUp ? `calc(100% - ${NAV.WIDTH + 1}px)` : "100%",
        left: isRtl ? 0 : "auto",
        right: isRtl ? "auto" : 0,
      }}
    >
      <div className="grow flex items-center px-4 lg:px-10 h-full">
        {!lgUp && (
          <button
            onClick={onOpenNav}
            className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Iconify
              icon="material-symbols-light:menu-rounded"
              width={30}
              height={30}
            />
          </button>
        )}

        <div className="grow" />

        <div className="flex items-center space-x-2">
          <NotificationsPopover />
          <LanguagePopover />
          <AccountPopover />
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
