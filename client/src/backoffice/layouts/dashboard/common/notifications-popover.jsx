import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

import { useRouter } from "../../../../routes/hooks";
import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationsPopover() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const axiosInstance = createAxiosInstance("admin"); // Assuming admin/vendor use same axios config or similar

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/dashboard-notifications");
      setNotifications(response.data.data);
      setUnreadCount(response.data.data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/dashboard-notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/dashboard-notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // 1. Mark as read
    if (!notification.is_read) {
      await markAsRead(notification._id);
    }

    // 2. Navigate based on type
    switch (notification.type) {
      case "ORDER_CREATED":
      case "PAYMENT_RECEIVED":
        // Ideally navigate to specific order detail if route exists, else order list
        router.push("/admin/order");
        break;
      case "REVIEW_ADDED":
        router.push("/admin/review");
        break;
      case "VENDOR_APPLIED":
        router.push("/admin/vendor");
        break;
      case "CONTACT_MESSAGE":
        router.push("/admin/contact");
        break;
      case "CUSTOMER_REGISTERED":
        router.push("/admin/customer");
        break;
      default:
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ORDER_CREATED":
        return "solar:cart-large-bold-duotone";
      case "REVIEW_ADDED":
        return "solar:star-bold-duotone";
      case "VENDOR_APPLIED":
        return "solar:shop-bold-duotone";
      case "CONTACT_MESSAGE":
        return "solar:letter-bold-duotone";
      case "CUSTOMER_REGISTERED":
        return "solar:user-plus-bold-duotone";
      case "PAYMENT_RECEIVED":
        return "solar:wad-of-money-bold-duotone";
      default:
        return "solar:bell-bold-duotone";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "ORDER_CREATED":
        return "text-blue-600 bg-blue-50";
      case "REVIEW_ADDED":
        return "text-yellow-600 bg-yellow-50";
      case "VENDOR_APPLIED":
        return "text-purple-600 bg-purple-50";
      case "CONTACT_MESSAGE":
        return "text-green-600 bg-green-50";
      case "CUSTOMER_REGISTERED":
        return "text-indigo-600 bg-indigo-50";
      case "PAYMENT_RECEIVED":
        return "text-emerald-600 bg-emerald-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/5 transition-all group"
        >
          <Iconify
            icon="solar:bell-bing-bold-duotone"
            width={24}
            className="text-gray-500 group-hover:text-primary"
          />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0.5 bg-red-500 text-white font-black text-[10px] ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 sm:w-96 p-0 overflow-hidden"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-widest text-gray-900">
              {t("Notifications")}
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              {unreadCount} {t("unread messages")}
            </span>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 hover:bg-primary/5 transition-all"
            >
              <Iconify
                icon="solar:check-read-bold-duotone"
                width={16}
                className="mr-1"
              />
              {t("Mark all read")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Iconify
                  icon="solar:bell-off-bold-duotone"
                  width={32}
                  className="text-gray-300"
                />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                {t("No new notifications")}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 flex gap-4 cursor-pointer focus:bg-gray-50 transition-all border-b border-gray-50 last:border-0 ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getColor(
                    notification.type,
                  )}`}
                >
                  <Iconify icon={getIcon(notification.type)} width={22} />
                </div>
                <div className="grow min-w-0 space-y-1">
                  <p
                    className={`text-xs font-black text-gray-900 leading-tight truncate ${
                      !notification.is_read ? "pr-4" : ""
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-[11px] font-medium text-gray-500 line-clamp-2 leading-normal italic">
                    {notification.message}
                  </p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest pt-1 flex items-center">
                    <Iconify
                      icon="solar:clock-circle-bold-duotone"
                      width={10}
                      className="mr-1"
                    />
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all"
          >
            {t("View All Activities")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
