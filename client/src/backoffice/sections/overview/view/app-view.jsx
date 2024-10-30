import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fDate, fDayMonth } from "../../../../utils/format-time";
import { format, isSameDay } from "date-fns";
import Loader from "../../../../frontoffice/components/loader/Loader";

export default function AppView() {
  const { t } = useTranslation();
  const admin = useSelector((state) => state.adminAuth);
  const [data, setData] = useState({
    customers: [],
    orders: [],
    loading: true,
  });

  let totalQuantity = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance('admin');
        const customersResponse = await axiosInstance.get("/customers");
        const ordersResponse = await axiosInstance.get("/orders");
        setData({
          customers: customersResponse.data.data,
          orders: ordersResponse.data.data,
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
      orders.map(order => {
        return new Date(order.order_date).setHours(0, 0, 0, 0);
      })
    );

    const sortedDates = Array.from(uniqueOrderDates).sort((a, b) => a - b);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(currentYear, currentMonth, i).setHours(0, 0, 0, 0);

      const formattedDate = format(currentDate, 'dd/MM');

      if (sortedDates.some(date => isSameDay(date, currentDate))) {
        labels.push(formattedDate);
      } else {
        labels.push(formattedDate);
      }
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
            (entry) => fDayMonth(entry.order_date) === date
          ).length;
        }),
      },
    ],
  };

  const totalCartTotalPrice = data.orders.reduce((acc, order) => {
    return acc + order.cart_total_price;
  }, 0);

  for (const order of data.orders) {
    for (const orderItem of order.order_items) {
      totalQuantity += orderItem.quantity;
    }
  }

  return (
    <Container maxWidth="xl">
      {data.loading ? (
        <Loader />
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {t("Welcome")}, {admin.first_name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              borderRadius: "16px",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              mb: 3,
            }}
          >
            <Grid item xs={6} md={3}>
              <AppWidgetSummary
                title={t("Sales")}
                total={totalQuantity}
                icon={
                  <Iconify
                    icon="material-symbols-light:shopping-bag"
                    width={72}
                    height={72}
                    color="primary.main"
                  />
                }
              />
            </Grid>

            <AppWidgetSummary
              title={t("Customers")}
              total={data.customers.length}
              icon={
                <Iconify
                  icon="material-symbols-light:contacts-product"
                  width={72}
                  height={72}
                  color="primary.main"
                />
              }
            />

            <AppWidgetSummary
              title={t("Orders")}
              total={data.orders.length}
              icon={
                <Iconify
                  icon="material-symbols-light:shopping-cart-rounded"
                  width={72}
                  height={72}
                  color="primary.main"
                />
              }
            />

            <AppWidgetSummary
              title={t("Revenues")}
              total={totalCartTotalPrice}
              currency={t("DH")}
              icon={
                <Iconify
                  icon="material-symbols-light:payments-rounded"
                  width={72}
                  height={72}
                  color="primary.main"
                />
              }
            />
          </Box>
          <Box sx={{ borderRadius: "16px", boxShadow: 1 }}>
            <Grid xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                title={t("New Orders")}
                subheader={t("Orders added each day")}
                chart={chartData}
              />
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
}
