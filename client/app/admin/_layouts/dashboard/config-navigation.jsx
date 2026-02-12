import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Iconify from "@/components/shared/iconify/iconify";

const useNavConfig = () => {
  const { t } = useTranslation();
  const { admin } = useSelector((state) => state.adminAuth);

  const isAdmin = admin?.role === "admin" || admin?.role === "manager";
  const isVendor = admin?.role === "vendor";
  const isDeliveryBoy = admin?.role === "delivery_boy";

  const navConfig = [
    ...(isAdmin
      ? [
          {
            title: "dashboard",
            path: "/admin/",
            icon: (
              <Iconify
                icon="material-symbols-light:dashboard-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          ...(admin?.role === "admin"
            ? [
                {
                  title: "user",
                  path: "/admin/user",
                  icon: (
                    <Iconify
                      icon="material-symbols-light:supervised-user-circle-outline"
                      width={30}
                      height={30}
                    />
                  ),
                },
              ]
            : []),
          {
            title: "customer",
            path: "/admin/customer",
            icon: (
              <Iconify
                icon="material-symbols-light:account-circle-outline"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "vendor",
            path: "/admin/vendor",
            icon: (
              <Iconify
                icon="material-symbols-light:store-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "category",
            path: "/admin/category",
            icon: (
              <Iconify
                icon="material-symbols-light:content-copy-outline"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "subcategory",
            path: "/admin/subcategory",
            icon: (
              <Iconify
                icon="material-symbols-light:border-all-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "contact",
            path: "/admin/contact",
            icon: (
              <Iconify
                icon="material-symbols-light:contact-mail-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "product",
            path: "/admin/product",
            icon: (
              <Iconify
                icon="material-symbols-light:shopping-cart-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "coupon",
            path: "/admin/coupon",
            icon: <Iconify icon="circum:discount-1" width={30} height={30} />,
          },
          {
            title: "order",
            path: "/admin/order",
            icon: (
              <Iconify
                icon="material-symbols-light:orders-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "notifications",
            path: "/admin/notification",
            icon: (
              <Iconify
                icon="material-symbols-light:notifications-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "payment list",
            path: "/admin/paymentlist",
            icon: (
              <Iconify
                icon="material-symbols-light:payments-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "review",
            path: "/admin/review",
            icon: (
              <Iconify
                icon="material-symbols-light:reviews-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          ...(admin?.role === "admin"
            ? [
                {
                  title: "localization",
                  path: "/admin/localization",
                  icon: (
                    <Iconify
                      icon="material-symbols-light:translate-rounded"
                      width={30}
                      height={30}
                    />
                  ),
                },
                {
                  title: "settings",
                  path: "/admin/settings",
                  icon: (
                    <Iconify
                      icon="material-symbols-light:settings-outline"
                      width={30}
                      height={30}
                    />
                  ),
                },
              ]
            : []),
        ]
      : []),
    ...(isVendor
      ? [
          {
            title: "dashboard",
            path: "/admin/",
            icon: (
              <Iconify
                icon="material-symbols-light:dashboard-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "product",
            path: "/admin/product",
            icon: (
              <Iconify
                icon="material-symbols-light:shopping-cart-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
          {
            title: "order",
            path: "/admin/order",
            icon: (
              <Iconify
                icon="material-symbols-light:orders-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
        ]
      : []),
    ...(isDeliveryBoy
      ? [
          {
            title: "order",
            path: "/admin/order",
            icon: (
              <Iconify
                icon="material-symbols-light:orders-outline-rounded"
                width={30}
                height={30}
              />
            ),
          },
        ]
      : []),
  ];

  return navConfig.map((item) => ({
    ...item,
    title: t(item.title),
  }));
};

export default useNavConfig;

