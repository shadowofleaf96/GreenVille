import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
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

function EditPaymentForm({ payment, onSave, onCancel, open, onClose }) {
  const [paymentMethods, setPaymentMethods] = useState([
    { key: "credit_card", label: "Credit Card" },
    { key: "paypal", label: "PayPal" },
    { key: "cod", label: "Cash on Delivery" }
  ]);
  const [statuses, setStatuses] = useState(
    [
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
      { key: "failed", label: "Failed" },
      { key: "refunded", label: "Refunded" }
    ]);
  const [editedPayment, setEditedPayment] = useState({
    ...payment,
  });
  const [loadingSave, setLoadingSave] = useState(false);

  const { t } = useTranslation();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedPayment({ ...editedPayment, [name]: value });
  };

  const handleStatusChange = (event) => {
    setEditedPayment({
      ...editedPayment,
      paymentStatus: event.target.value,
    });
  };

  const handlePaymentMethodChange = (event) => {
    setEditedPayment({
      ...editedPayment,
      paymentMethod: event.target.value,
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      const { _id, amount, paymentMethod, paymentStatus } = editedPayment;

      const updatedPayment = {
        _id,
        amount,
        paymentMethod,
        paymentStatus,
      };

      await onSave(updatedPayment);
      onClose();
    } catch (error) {
      console.error("Error saving payment:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {payment ? (
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
            {t('Edit Payment')}
          </Typography>

          <TextField
            label={t('Amount')}
            name="amount"
            type="number"
            value={editedPayment.amount}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="paymentMethod">{t('Payment Method')}</InputLabel>
            <Select
              label={t('Payment Method')}
              id="paymentMethod"
              name="paymentMethod"
              value={editedPayment.paymentMethod}
              onChange={handlePaymentMethodChange}
              fullWidth
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.key} value={method.key}>
                  {`${t(method.label)}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="paymentStatus">{t('Payment Status')}</InputLabel>
            <Select
              label={t('Payment Status')}
              id="paymentStatus"
              name="paymentStatus"
              value={editedPayment.paymentStatus}
              onChange={handleStatusChange}
              fullWidth
            >
              {statuses.map((status) => (
                <MenuItem key={status.key} value={status.key}>
                  {t(status.label)}
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
        <Loader />
      )}
    </Modal>
  );
}

export default EditPaymentForm;
