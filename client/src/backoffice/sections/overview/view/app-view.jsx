import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import AppCurrentVisits from "../app-current-visits";
import AppRecentReviews from "../app-recent-reviews";
import AppTopProducts from "../app-top-products";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fDayMonth } from "../../../../utils/format-time";
import { format, isSameDay } from "date-fns";
import Loader from "../../../../frontoffice/components/loader/Loader";

export default function AppView() {
  const { t } = useTranslation();
  const admin = useSelector((state) => state.adminAuth);
  const { data: settings } = useSelector((state) => state.adminSettings);
  const [data, setData] = useState({
    customers: [],
    orders: [],
    stats: {
      orderStatusDistribution: [],
      topProducts: [],
      customerGrowth: [],
      categorySales: [],
      recentReviews: [],
    },
    loading: true,
  });

  let totalQuantity = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const customersResponse = await axiosInstance.get("/customers");
        const ordersResponse = await axiosInstance.get("/orders");
        const statsResponse = await axiosInstance.get("/dashboard/stats");
        setData({
          customers: customersResponse.data.data,
          orders: ordersResponse.data.data,
          stats: statsResponse.data,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          customers: [],
          orders: [],
          loading: false,
        });
      }
    };

    fetchData();
  }, []);

  function generateLabelsFromOrders(orders) {
    const labels = [];
    const uniqueOrderDates = new Set(
      orders.map((order) => new Date(order.order_date).setHours(0, 0, 0, 0)),
    );
    const sortedDates = Array.from(uniqueOrderDates).sort((a, b) => a - b);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(currentYear, currentMonth, i).setHours(
        0,
        0,
        0,
        0,
      );
      labels.push(format(currentDate, "dd/MM"));
    }
    return labels;
  }

  const labels = generateLabelsFromOrders(data.orders);

  const chartData = {
    labels: labels,
    series: [
      {
        name: t("Orders"),
        type: "area",
        fill: "gradient",
        data: labels.map((date) => {
          return data.orders.filter(
            (entry) => fDayMonth(entry.order_date) === date,
          ).length;
        }),
      },
    ],
  };

  const totalCartTotalPrice = data.orders.reduce((acc, order) => {
    if (admin?.role === "vendor") {
      return (
        acc +
        order.order_items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        )
      );
    }
    return acc + order.cart_total_price;
  }, 0);

  for (const order of data.orders) {
    for (const orderItem of order.order_items) {
      totalQuantity += orderItem.quantity;
    }
  }

  if (data.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const primaryColor = settings?.theme?.primary_color || "#8DC63F";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="mb-2">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Welcome")},{" "}
          <span style={{ color: primaryColor }}>{admin.first_name}</span>
        </h4>
        <p className="text-gray-500 mt-1 font-medium">
          {t("Here's what's happening today.")}
        </p>
      </header>

      {/* Stats Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AppWidgetSummary
          title={t("Sales")}
          total={totalQuantity}
          color={primaryColor}
          icon={
            <Iconify
              icon="material-symbols-light:shopping-bag"
              width={32}
              height={32}
            />
          }
        />

        <AppWidgetSummary
          title={t("Customers")}
          total={data.customers.length}
          color={primaryColor}
          icon={
            <Iconify
              icon="material-symbols-light:contacts-product"
              width={32}
              height={32}
            />
          }
        />

        <AppWidgetSummary
          title={t("Orders")}
          total={data.orders.length}
          color={primaryColor}
          icon={
            <Iconify
              icon="material-symbols-light:shopping-cart-rounded"
              width={32}
              height={32}
            />
          }
        />

        <AppWidgetSummary
          title={t("Revenues")}
          total={totalCartTotalPrice}
          currency={t("DH")}
          color={primaryColor}
          icon={
            <Iconify
              icon="material-symbols-light:payments-rounded"
              width={32}
              height={32}
            />
          }
        />
      </div>

      {/* Main Charts Row: New Orders (100%) */}
      <AppWebsiteVisits
        title={t("New Orders")}
        subheader={t("Orders added each day")}
        chart={{
          ...chartData,
          colors: [primaryColor],
        }}
      />

      {/* Secondary Charts Row: Status & Category (50/50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AppCurrentVisits
          title={t("Order Status")}
          chart={{
            colors: [primaryColor, "#FFAB00", "#FF5630", "#00B8D9"],
            series: data.stats.orderStatusDistribution,
          }}
        />

        <AppCurrentVisits
          title={t("Category Sales")}
          chart={{
            colors: [primaryColor, "#00B8D9", "#FFAB00", "#FF5630", "#00A76F"],
            series: data.stats.categorySales,
          }}
        />
      </div>

      {/* Detail Lists Row: Top Products & Reviews (50/50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AppTopProducts
          title={t("Top Products")}
          list={data.stats.topProducts}
        />

        <AppRecentReviews
          title={t("Recent Reviews")}
          list={data.stats.recentReviews}
        />
      </div>
    </div>
  );
}
