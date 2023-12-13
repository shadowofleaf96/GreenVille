import { useTranslation } from "react-i18next";
import Iconify from "../../components/iconify/iconify";

const navConfig = [
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
    title: "product",
    path: "/admin/products",
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
  // Completing it Later
  // {
  //   title: "payment list",
  //   path: "/paymentlist",
  //   icon: <Iconify icon="material-symbols-light:payments-outline-rounded" width={30} height={30} />,
  // },
];

const TranslatedNavConfig = () => {
  const { t } = useTranslation();

  return navConfig.map((item) => ({
    ...item,
    title: t(item.title),
  }));
};

export default TranslatedNavConfig;
