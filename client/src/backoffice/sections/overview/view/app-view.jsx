import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Iconify from "../../../components/iconify";
import CircularProgress from "@mui/material/CircularProgress";
import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";

import { fDate } from "../../../../utils/format-time";

export default function AppView() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.adminAuth.adminUser);
  const [data, setData] = useState({
    customers: [],
    orders: [],
    loading: true,
  });

  let totalQuantity = 0;
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get("/v1/customers");
        const ordersResponse = await axios.get("/v1/orders");
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

  function generateLabelsForHalfOfMonth() {
    const labels = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    const daysToGenerate = Math.min(20, daysInCurrentMonth);

    for (let day = 1; day <= daysToGenerate; day++) {
      const formattedMonth = String(currentMonth + 1).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      const formattedDate = `${formattedMonth}/${formattedDay}/${currentYear}`;
      labels.push(formattedDate);
    }

    return labels;
  }

  const labels = generateLabelsForHalfOfMonth();

  const chartData = {
    labels: labels,
    series: [
      {
        name: t("Customers"),
        type: "line",
        fill: "solid",
        data: labels.map((date) => {
          const formattedDate = fDate(date);
          return data.customers.filter(
            (entry) => fDate(entry.last_login) === formattedDate
          ).length;
        }),
      },
      {
        name: t("Orders"),
        type: "area",
        fill: "gradient",
        data: labels.map((date) => {
          const formattedDate = fDate(date);
          return data.orders.filter(
            (entry) => fDate(entry.order_date) === formattedDate
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
        <Stack style={containerStyle}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {t("Welcome")}, {user.first_name}
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
              currency="DH"
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
                title={t("Last Sign in Customers and New Orders Added")} // Translating title
                subheader={t("Customers sign in and orders added each day")}
                chart={chartData}
              />
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
}
