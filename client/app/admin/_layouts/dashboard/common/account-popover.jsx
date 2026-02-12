"use client";

import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/shared/iconify";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { logout } from "@/store/slices/admin/authSlice";

export default function AccountPopover() {
  const { admin } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const logOut = async () => {
    try {
      localStorage.removeItem("user_access_token");
      dispatch(logout({}));
      router.push("/admin/login");
    } catch (error) {
      toast.error(
        t("Logout Error") +
          ": " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full p-0 hover:bg-primary/5 focus-visible:ring-primary/20"
        >
          <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
            <AvatarImage
              src={admin?.user_image}
              alt={admin?.user_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {admin?.user_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-gray-900">
              {admin?.user_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {admin?.email}
            </p>
            {admin?.role === "vendor" && (
              <p className="text-[10px] font-black text-primary uppercase pt-1">
                {t("Vendor Account")}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href="/admin/profile">
          <DropdownMenuItem className="cursor-pointer py-2.5 focus:bg-primary/5 focus:text-primary group">
            <Iconify
              icon="material-symbols-light:contacts-product-outline"
              width={24}
              height={24}
              className="mr-3 text-gray-400 group-focus:text-primary"
            />
            <span className="font-medium">{t("profile")}</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logOut}
          className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 font-bold"
        >
          <Iconify
            icon="material-symbols-light:exit-to-app-rounded"
            width={24}
            height={24}
            className="mr-3"
          />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
