import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import TableContainer from "@mui/material/TableContainer";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from 'react-i18next';
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify/index.js";
import Scrollbar from "../../../components/scrollbar/index.js";

import TableNoDataFilter from "../table-no-data.jsx";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentTableRow from "../payment-table-row.jsx";
import PaymentTableHead from "../payment-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import PaymentTableToolbar from "../payment-table-toolbar.jsx";
import EditPaymentForm from "../payment-edit.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/paymentListSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function PaymentPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminPaymentList.data);
  const error = useSelector((state) => state.adminPaymentList.error);
  const loading = useSelector((state) => state.adminPaymentList.loading);
  const filterName = useSelector((state) => state.adminPaymentList.filterName);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [totalPriceFilter, setTotalPriceFilter] = useState("");
  const [selectedDeletePaymentId, setSelectedDeletePaymentId] = useState(null);
  const [page, setPage] = useState(0);
  const [payment, setPayment] = useState("asc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentBy, setPaymentBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance('admin');

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/payments");
      const data = response.data.data;
      dispatch(setData(data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(setData(data));
  }, [dispatch]);

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return <Typography variant="body2">Error : {error.message} </Typography>;
  }

  if (!data && !loading) {
    return <Typography variant="body2">No Data found</Typography>;
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

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const openDeleteConfirmation = (event, paymentId) => {
    setSelectedDeletePaymentId(paymentId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeletePaymentId(null);
    setDeleteConfirmationOpen(false);
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    const value = event.target.value;
    dispatch(setFilterName(value));
    setPage(0);
  };

  const handleFilterByMethod = (event) => {
    const value = event.target.value;
    setPaymentMethodFilter(value);
    setPage(0);
  };

  const handleFilterByTotalPrice = (event) => {
    const value = event.target.value;
    setTotalPriceFilter(value);
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

      const payload = {
        paymentStatus,
        amount,
        paymentMethod,
      };

      const response = await axiosInstance.put(`/payments/${_id}`, payload);

      const index = data.findIndex((payment) => payment._id === _id);

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
      console.error("Error editing payment:" + error);

      toast.error(
        "Error: " + error.response?.data.message || "An error occurred"
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
  };

  const handleDeletePayment = async (paymentId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/payments/${paymentId}`);
      const updatedPayments = data.filter(
        (payment) => payment._id !== paymentId
      );
      dispatch(setData(updatedPayments));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(payment, paymentBy),
    filterName,
    paymentMethodFilter,
    totalPriceFilter,
  });

  const notFound = !dataFiltered.length;
  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">{t('Payments')}</Typography>
      </Stack>

      <Card>
        <PaymentTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          paymentMethodFilter={paymentMethodFilter}
          onMethodFilter={handleFilterByMethod}
          totalPriceFilter={totalPriceFilter}
          onTotalPriceFilter={handleFilterByTotalPrice}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <PaymentTableHead
                payment={payment}
                paymentBy={paymentBy}
                rowCount={data.length}
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
                  // { id: "paymentCredentials", label: t("Payment Credentials") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <PaymentTableRow
                        key={row._id}
                        ordererName={`${row.order.customer.first_name + " " + row.order.customer.last_name}`}
                        amount={row.amount}
                        paymentMethod={row.paymentMethod}
                        currency={row.currency}
                        createdAt={row.createdAt}
                        paymentStatus={row.paymentStatus}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditPayment(row)}
                        onDelete={(event) => openDeleteConfirmation(event, row._id)}
                      />
                    );
                  })}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, data.length)}
                />
                {notFound && <TableNoDataFilter query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={data.length}
          labelRowsPerPage={t("Rows per page:")}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {editingPayment && (
        <EditPaymentForm
          payment={editingPayment}
          onSave={handleSaveEditedPayment}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      <Backdrop
        open={isDeleteConfirmationOpen}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={closeDeleteConfirmation}
      />

      <Popover
        anchorEl={anchorEl}
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            width: 250,
            p: 2,
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        <Typography sx={{ mb: 1 }} component="div" variant="subtitle1">
          {t('Are you sure you want to delete this element?')}
        </Typography>
        <LoadingButton
          color="primary"
          loading={loadingDelete}
          onClick={() => {
            handleDeletePayment(selectedDeletePaymentId);
            closeDeleteConfirmation();
          }}
        >
          {t('Confirm')}
        </LoadingButton>
        <Button color="secondary" onClick={closeDeleteConfirmation}>
          {t('Cancel')}
        </Button>
      </Popover>
    </Container>
  );
}