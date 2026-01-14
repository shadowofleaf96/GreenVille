import { useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import Iconify from "../../../components/iconify";
import Loader from "../../../frontoffice/components/loader/Loader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditPaymentForm({ payment, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);
  const [editedPayment, setEditedPayment] = useState({ ...payment });

  const paymentMethods = [
    { key: "credit_card", label: "Credit Card" },
    { key: "paypal", label: "PayPal" },
    { key: "cod", label: "Cash on Delivery" },
  ];

  const statuses = [
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "failed", label: "Failed" },
    { key: "refunded", label: "Refunded" },
  ];

  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedPayment({ ...editedPayment, [name]: sanitizeInput(value) });
  };

  const handleStatusChange = (value) => {
    setEditedPayment({
      ...editedPayment,
      paymentStatus: sanitizeInput(value),
    });
  };

  const handlePaymentMethodChange = (value) => {
    setEditedPayment({
      ...editedPayment,
      paymentMethod: sanitizeInput(value),
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const { _id, amount, paymentMethod, paymentStatus } = editedPayment;

      const updatedPayment = {
        _id,
        amount: sanitizeInput(amount.toString()),
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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Edit Payment")}
          </DialogTitle>
        </DialogHeader>

        {payment ? (
          <div className="p-8 pt-4 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Amount")}
              </Label>
              <Input
                name="amount"
                type="number"
                value={editedPayment.amount}
                onChange={handleFieldChange}
                placeholder={t("Enter amount")}
                className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all text-base font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Payment Method")}
              </Label>
              <Select
                value={editedPayment.paymentMethod}
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all text-sm font-medium">
                  <SelectValue placeholder={t("Select Method")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.key} value={method.key}>
                      {t(method.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Payment Status")}
              </Label>
              <Select
                value={editedPayment.paymentStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all text-sm font-medium">
                  <SelectValue placeholder={t("Select Status")} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {t(status.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex flex-row sm:justify-between items-center gap-4 pt-4 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={loadingSave}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loadingSave ? (
                  <div className="flex items-center gap-2">
                    <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                    {t("Saving...")}
                  </div>
                ) : (
                  t("Save")
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="p-20 flex items-center justify-center">
            <Loader />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditPaymentForm;
