import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import TableContainer from "@mui/material/TableContainer";
import Backdrop from "@mui/material/Backdrop";
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
import OrderTableRow from "../order-table-row.jsx";
import OrderTableHead from "../order-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import OrderTableToolbar from "../order-table-toolbar.jsx";
import EditOrderForm from "../order-edit.jsx";
import OrderDetailsPopup from "../order-details.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/orderSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function OrderPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminOrder.data);
  const error = useSelector((state) => state.adminOrder.error);
  const loading = useSelector((state) => state.adminOrder.loading);
  const filterName = useSelector((state) => state.adminOrder.filterName);
  const [itemsFilter, setItemsFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalPriceFilter, setTotalPriceFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteOrderId, setSelectedDeleteOrderId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance('admin');

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/orders");
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
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
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

  const openDeleteConfirmation = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeleteOrderId(orderId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteOrderId(null);
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

  const handleFilterByItems = (event) => {
    const value = event.target.value;
    setItemsFilter(value);
    setPage(0);
  };

  const handleFilterByTotalPrice = (event) => {
    const value = event.target.value;
    setTotalPriceFilter(value);
    setPage(0);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOpenModal(true);
  };

  const handleSaveEditedOrder = async (editedOrder) => {
    setLoadingDelete(true);

    try {
      const { _id, customer, status, cart_total_price } = editedOrder;

      const { _id: customer_id, first_name, last_name } = customer;

      const payload = {
        customer_id,
        customer_name: `${first_name} ${last_name}`,
        status,
        cart_total_price,
      };

      const response = await axiosInstance.put(`/orders/${_id}`, payload);

      const index = data.findIndex((order) => order._id === _id);

      if (index !== -1) {
        const updatedOrders = [...data];
        updatedOrders[index] = {
          ...updatedOrders[index],
          customer_id,
          customer: {
            _id: customer_id,
            first_name,
            last_name,
          },
          status,
          cart_total_price,
        };

        dispatch(setData(updatedOrders));

        toast.success(response.data.message);
        setEditingOrder(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing order:" + error);

      toast.error(
        "Error: " + error.response?.data.message || "An error occurred"
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}`);
      const updatedSubCategories = data.filter(
        (order) => order._id !== orderId
      );
      dispatch(setData(updatedSubCategories));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (order) => {
    setSelectedOrder(order);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
    itemsFilter,
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
        <Typography variant="h4">{t('Orders')}</Typography>
      </Stack>

      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          itemsFilter={itemsFilter}
          onItemsFilter={handleFilterByItems}
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
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "customer", label: t("Customer Name") },
                  { id: "order_items", label: t("Order Items") },
                  { id: "cart_total_price", label: t("Cart Total Price") },
                  { id: "order_date", label: t("Order Date") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const orderItemsArray = Object.values(row.order_items);
                    return (
                      <OrderTableRow
                        key={row._id}
                        customer={row.customer}
                        order_items={orderItemsArray}
                        cart_total_price={row.cart_total_price}
                        order_date={row.order_date}
                        status={row.status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditOrder(row)}
                        onDelete={(event) => openDeleteConfirmation(event, row._id)}
                        onDetails={() => handleOpenDetailsPopup(row)}
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

      <OrderDetailsPopup
        order={selectedOrder}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      {editingOrder && (
        <EditOrderForm
          order={editingOrder}
          onSave={handleSaveEditedOrder}
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
          },
        }}
      >
        <Typography sx={{ mb: 1 }} component="div" variant="subtitle1">
          {t('Are you sure you want to delete this element ?')}
        </Typography>
        <LoadingButton
          color="primary"
          loading={loadingDelete}
          onClick={() => {
            handleDeleteOrder(selectedDeleteOrderId);
            closeDeleteConfirmation();
          }}
        >
          {t('Confirm')}
        </LoadingButton>
        <Button color="secondary" onClick={closeDeleteConfirmation}>{t('Cancel')}</Button>
      </Popover>
    </Container>
  );
}