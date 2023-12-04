import { useTranslation } from "react-i18next";
import Iconify from "../../components/iconify/iconify";

const navConfig = [
  {
    title: "dashboard",
    path: "/",
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
    path: "/user",
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
    path: "/customer",
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
    path: "/category",
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
    path: "/subcategory",
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
    path: "/products",
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
    path: "/order",
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
