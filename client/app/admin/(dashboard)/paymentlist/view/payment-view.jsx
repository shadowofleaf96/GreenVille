"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "@/components/shared/iconify";
import Scrollbar from "@/admin/_components/scrollbar";
import TableNoDataFilter from "@/admin/_components/table/TableNoData";
import PaymentTableRow from "../payment-table-row";
import PaymentTableHead from "../payment-table-head";
import TableEmptyRows from "@/admin/_components/table/TableEmptyRows";
import PaymentTableToolbar from "../payment-table-toolbar";
import EditPaymentForm from "../payment-edit";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "@/store/slices/admin/paymentListSlice";
import Loader from "@/frontoffice/_components/loader/Loader";
import createAxiosInstance from "@/utils/axiosConfig";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminPaymentList.data);
  const error = useSelector((state) => state.adminPaymentList.error);
  const loading = useSelector((state) => state.adminPaymentList.loading);
  const filterName = useSelector((state) => state.adminPaymentList.filterName);

  const [page, setPage] = useState(0);
  const [payment, setPayment] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [paymentBy, setPaymentBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [totalPriceFilter, setTotalPriceFilter] = useState("");
  const [selectedDeletePaymentId, setSelectedDeletePaymentId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/payments");
      dispatch(setData(response.data.data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (loading && !data) return <Loader />;

  if (error) {
    return (
      <div className="p-8 text-destructive font-bold text-center">
        {t("Error")}: {error.message}
      </div>
    );
  }

  const handleSort = (event, id) => {
    const isAsc = paymentBy === id && payment === "asc";
    if (id !== "") {
      setPayment(isAsc ? "desc" : "asc");
      setPaymentBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0)
      newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1)
      newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    setSelected(newSelected);
  };

  const openDeleteConfirmation = (event, paymentId) => {
    setSelectedDeletePaymentId(paymentId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeletePaymentId(null);
    setDeleteConfirmationOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    dispatch(setFilterName(event.target.value));
    setPage(0);
  };

  const handleFilterByMethod = (event) => {
    setPaymentMethodFilter(event.target.value);
    setPage(0);
  };

  const handleFilterByTotalPrice = (event) => {
    setTotalPriceFilter(event.target.value);
    setPage(0);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setOpenModal(true);
  };

  const handleSaveEditedPayment = async (editedPayment) => {
    setLoadingDelete(true);
    try {
      const { _id, paymentStatus, amount, paymentMethod } = editedPayment;
      const payload = { paymentStatus, amount, paymentMethod };
      const response = await axiosInstance.put(`/payments/${_id}`, payload);

      const index = data.findIndex((p) => p._id === _id);
      if (index !== -1) {
        const updatedPayments = [...data];
        updatedPayments[index] = {
          ...updatedPayments[index],
          paymentStatus,
          amount,
          paymentMethod,
        };
        dispatch(setData(updatedPayments));
        toast.success(response.data.message);
        setEditingPayment(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing payment:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDeletePayment = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/payments/${selectedDeletePaymentId}`,
      );
      const updatedPayments = data.filter(
        (p) => p._id !== selectedDeletePaymentId,
      );
      dispatch(setData(updatedPayments));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleFilterStatus = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(payment, paymentBy),
    filterName,
    paymentMethodFilter,
    totalPriceFilter,
  }).filter((item) => {
    if (statusFilter !== "all" && item.paymentStatus !== statusFilter)
      return false;
    return true;
  });

  const notFound = !dataFiltered.length && !loading;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Payments")}
        </h4>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <PaymentTableToolbar
            numSelected={selected.length}
            selected={selected}
            setSelected={setSelected}
            filterName={filterName}
            onFilterName={handleFilterByName}
            paymentMethodFilter={paymentMethodFilter}
            onMethodFilter={handleFilterByMethod}
            totalPriceFilter={totalPriceFilter}
            onTotalPriceFilter={handleFilterByTotalPrice}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            onStatusFilter={handleFilterStatus}
          />

          <Scrollbar>
            <Table>
              <PaymentTableHead
                payment={payment}
                paymentBy={paymentBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "ordererName", label: t("Orderer Name") },
                  { id: "amount", label: t("Amount") },
                  { id: "paymentMethod", label: t("Payment Method") },
                  { id: "currency", label: t("Currency") },
                  { id: "createdAt", label: t("Payment Date") },
                  { id: "paymentStatus", label: t("Payment Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          width={40}
                          className="text-primary"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <PaymentTableRow
                          key={row._id}
                          ordererName={`${
                            row.order?.customer?.first_name || ""
                          } ${row.order?.customer?.last_name || ""}`}
                          amount={row.amount}
                          paymentMethod={row.paymentMethod}
                          currency={row.currency}
                          createdAt={row.createdAt}
                          paymentStatus={row.paymentStatus}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={(event) => handleClick(event, row._id)}
                          onEdit={() => handleEditPayment(row)}
                          onDelete={(event) =>
                            openDeleteConfirmation(event, row._id)
                          }
                        />
                      ))}

                    {!notFound && (
                      <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(
                          page,
                          rowsPerPage,
                          dataFiltered.length,
                        )}
                      />
                    )}

                    {notFound && (
                      <TableNoDataFilter
                        query={filterName}
                        colSpan={8}
                        resourceName="Payments"
                      />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>

          <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-500">
              {t("Total")}:{" "}
              <span className="text-gray-900 font-bold">
                {dataFiltered.length}
              </span>{" "}
              {t("payments")}
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                  {t("Rows per page")}:
                </span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(v) => handleRowsPerPageChange(parseInt(v))}
                >
                  <SelectTrigger className="w-17.5 bg-transparent border-none text-sm font-bold shadow-none focus:ring-0 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
                >
                  <Iconify icon="material-symbols:chevron-left" width={20} />
                </Button>
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-primary min-w-9 text-center">
                  {page + 1}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={(page + 1) * rowsPerPage >= dataFiltered.length}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
                >
                  <Iconify icon="material-symbols:chevron-right" width={20} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingPayment && (
        <EditPaymentForm
          payment={editingPayment}
          onSave={handleSaveEditedPayment}
          onCancel={() => setEditingPayment(null)}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none">
          <DialogHeader>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Iconify
                icon="material-symbols:warning-outline-rounded"
                width={32}
                height={32}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("Confirm Deletion")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-base leading-relaxed">
              {t(
                "Are you sure you want to delete this element ? This action cannot be undone.",
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              disabled={loadingDelete}
              onClick={handleDeletePayment}
              className="w-full h-12 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
            >
              {loadingDelete ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Deleting...")}
                </div>
              ) : (
                t("Yes, Delete")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={closeDeleteConfirmation}
              className="w-full h-12 bg-gray-50 text-gray-600 font-bold border-none rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              {t("Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
