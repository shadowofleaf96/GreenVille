// Shadow Of Leaf was Here

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from 'react-i18next'; // Importing translation hook

function EditOrderForm({ order, onSave, onCancel, open, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState(["open", "processing", "completed"]);
  const [editedOrder, setEditedOrder] = useState({
    ...order,
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  const { t } = useTranslation(); // Using translation hook

  useEffect(() => {
    // Fetch customers and other necessary data when the component mounts
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get("/v1/customers");
        setCustomers(customersResponse.data.data);
        // You can fetch other data if needed for the form
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed (display an error message, etc.)
      } finally {
        setLoadingSubcategories(false); // Set loading to false when data is fetched
      }
    };

    fetchData();
  }, []);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
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
        first_name: first_name,
        last_name: last_name,
        email: email,
      },
    }));
  };

  const handleStatusChange = (event) => {
    setEditedOrder({
      ...editedOrder,
      status: event.target.value,
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      // Validate and format the data as needed
      const { _id, customer, order_date, cart_total_price, status } =
        editedOrder;

      console.log(editedOrder);
      const updatedOrder = {
        _id,
        customer,
        order_date,
        cart_total_price,
        status,
      };

      await onSave(updatedOrder);
      onClose(); // Close the modal after a successful save
    } catch (error) {
      console.error("Error saving order:", error);
      // Handle the error as needed (display an error message, etc.)
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {!loadingSubcategories ? (
        <Stack
          style={{
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
              value={editedOrder.customer._id}
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
                  {t(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <LoadingButton
              loading={loadingSave}
              onClick={handleSave}
              variant="contained"
              sx={{ flex: 1 }}
            >
              {t('Save')}
            </LoadingButton>
            <Button
              onClick={onCancel}
              variant="outlined"
              sx={{ flex: 1 }}
            >
              {t('Cancel')}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack style={containerStyle}>
          <CircularProgress />
        </Stack>
      )}
    </Modal>
  );
}

export default EditOrderForm;
