import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from 'react-i18next';
import Loader from "../../../frontoffice/components/loader/Loader";
import createAxiosInstance from "../../../utils/axiosConfig";
import DOMPurify from "dompurify";

function EditOrderForm({ order, onSave, onCancel, open, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState(["open", "processing", "canceled", "completed"]);
  const [shippingStatuses, setShippingStatuses] = useState([
    { value: "not_shipped", label: "Not Shipped" },
    { value: "shipped", label: "Shipped" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
  ]);
  const [shippingMethods, setShippingMethods] = useState([
    { value: "standard", label: "Standard Shipping" },
    { value: "express", label: "Express Shipping" },
    { value: "overnight", label: "Overnight Shipping" },
  ]);
  const [editedOrder, setEditedOrder] = useState({
    ...order,
    shipping_address: {
      street: order.shipping_address?.street || "",
      city: order.shipping_address?.city || "",
      postal_code: order.shipping_address?.postal_code || "",
      country: order.shipping_address?.country || "",
    },
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance('admin');
        const customersResponse = await axiosInstance.get("/customers");
        setCustomers(customersResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setEditedOrder({ ...editedOrder, [name]: sanitizedValue });
  };

  const handleCustomerChange = (event) => {
    const selectedCustomer = customers.find(
      (customer) => customer._id === event.target.value
    );

    const { first_name, last_name, email } = selectedCustomer;
    setEditedOrder((prev) => ({
      ...prev,
      customer: {
        _id: selectedCustomer._id,
        first_name,
        last_name,
        email,
      },
    }));
  };

  const handleStatusChange = (event) => {
    setEditedOrder({
      ...editedOrder,
      status: event.target.value,
    });
  };

  const handleShippingStatusChange = (event) => {
    setEditedOrder({
      ...editedOrder,
      shipping_status: event.target.value,
    });
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setEditedOrder({
      ...editedOrder,
      shipping_address: {
        ...editedOrder.shipping_address,
        [name]: sanitizedValue,
      },
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      const { _id, customer, status, cart_total_price, shipping_method, shipping_status, order_notes, shipping_address } = editedOrder;

      const updatedOrder = {
        _id,
        customer,
        status,
        cart_total_price,
        shipping_method,
        shipping_status,
        order_notes,
        shipping_address,
      };

      await onSave(updatedOrder);
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          p: 4,
          width: 500,
          color: "#333",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "16px",
          margin: "0 16px",
          padding: "20px",
        }}
      >
        {!loadingSubcategories ? (
          <>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#3f51b5", marginBottom: 2 }}
            >
              {t('Edit Order')}
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="customer">{t('Customer')}</InputLabel>
              <Select
                label={t('Customer')}
                id="customer"
                name="customer_id"
                value={editedOrder.customer?._id || ""}
                onChange={handleCustomerChange}
                fullWidth
              >
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {`${customer.first_name} ${customer.last_name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('Cart Total Price')}
              name="cart_total_price"
              type="number"
              value={editedOrder.cart_total_price}
              onChange={handleFieldChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="shipping_status">{t('Shipping Status')}</InputLabel>
              <Select
                label={t('Shipping Status')}
                id="shipping_status"
                name="shipping_status"
                value={editedOrder.shipping_status}
                onChange={handleShippingStatusChange}
                fullWidth
              >
                {shippingStatuses.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="shipping_method">{t('Shipping Method')}</InputLabel>
              <Select
                label={t('Shipping Method')}
                id="shipping_method"
                name="shipping_method"
                value={editedOrder.shipping_method}
                onChange={handleFieldChange}
                fullWidth
              >
                {shippingMethods.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Two input fields in one line for Street and City */}
            <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
              <TextField
                label={t('Street')}
                name="street"
                value={editedOrder.shipping_address.street}
                onChange={handleShippingAddressChange}
                fullWidth
              />
              <TextField
                label={t('City')}
                name="city"
                value={editedOrder.shipping_address.city}
                onChange={handleShippingAddressChange}
                fullWidth
              />
            </Stack>

            {/* Two input fields in one line for Postal Code and Country */}
            <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
              <TextField
                label={t('Postal Code')}
                name="postal_code"
                value={editedOrder.shipping_address.postal_code}
                onChange={handleShippingAddressChange}
                fullWidth
              />
              <TextField
                label={t('Country')}
                name="country"
                value={editedOrder.shipping_address.country}
                onChange={handleShippingAddressChange}
                fullWidth
              />
            </Stack>

            <TextField
              label={t('Order Notes')}
              name="order_notes"
              value={editedOrder.order_notes}
              onChange={handleFieldChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="status">{t('Status')}</InputLabel>
              <Select
                label={t('Status')}
                id="status"
                name="status"
                value={editedOrder.status}
                onChange={handleStatusChange}
                fullWidth
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(status.charAt(0).toUpperCase() + status.slice(1))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
              <LoadingButton
                onClick={handleSave}
                loading={loadingSave}
                variant="contained"
                color="primary"
                sx={{ flex: 1 }}
              >
                {t('Save')}
              </LoadingButton>
              <Button onClick={onClose} fullWidth variant="outlined" sx={{ flex: 1 }}
                color="secondary">
                {t('Cancel')}
              </Button>
            </Stack>
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Modal>
  );
}

export default EditOrderForm;
