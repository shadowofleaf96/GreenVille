import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import TableContainer from "@mui/material/TableContainer";
import Backdrop from "@mui/material/Backdrop";
import TablePagination from "@mui/material/TablePagination";

import Scrollbar from "../../../components/scrollbar";

import TableNoDataFilter from "../table-no-data";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerTableRow from "../customer-table-row";
import CustomerTableHead from "../customer-table-head";
import TableEmptyRows from "../table-empty-rows";
import CustomerTableToolbar from "../customer-table-toolbar";
import EditCustomerForm from "../customer-edit";
import CustomerDetailsPopup from "../customer-details";
import { useTranslation } from "react-i18next";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/customerSlice";
import Loader from "../../../../frontoffice/components/loader/Loader";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
const backend = import.meta.env.VITE_BACKEND_URL;


// ----------------------------------------------------------------------

export default function CustomerView() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminCustomer.data);
  const error = useSelector((state) => state.adminCustomer.error);
  const loading = useSelector((state) => state.adminCustomer.loading);
  const filterName = useSelector((state) => state.adminCustomer.filterName);
  const [emailFilter, setEmailFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteCustomerId, setSelectedDeleteCustomerId] =
    useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmationAnchorEl, setDeleteConfirmationAnchorEl] =
    useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const axiosInstance = createAxiosInstance('admin');

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/customers");

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

  const openDeleteConfirmation = (customerId, event) => {
    setSelectedDeleteCustomerId(customerId);
    setDeleteConfirmationAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteCustomerId(null);
    setDeleteConfirmationOpen(false);
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

  const handleFilterByEmail = (event) => {
    const value = event.target.value;
    setEmailFilter(value);
    setPage(0);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleSaveEditedCustomer = async (editedCustomer, selectedImage) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("first_name", editedCustomer.first_name);
      formData.append("last_name", editedCustomer.last_name);
      formData.append("password", editedCustomer.password);
      formData.append("email", editedCustomer.email);
      formData.append("role", editedCustomer.role);
      formData.append("status", editedCustomer.status);
      Object.entries(editedCustomer.shipping_address).forEach(([key, value]) => {
        formData.append(`shipping_address[${key}]`, value);
      });


      if (selectedImage) {
        formData.append("customer_image", selectedImage);
      }
      const response = await axiosInstance.put(
        `/customers/${editedCustomer._id}`,
        formData
      );

      const index = data.findIndex(
        (customer) => customer._id === editedCustomer._id
      );

      if (index !== -1) {
        const updatedCustomers = [...data];
        const customerData = response.data.data;
        updatedCustomers[index] = {
          ...updatedCustomers[index],
          customer_image: customerData.customer_image,
          first_name: editedCustomer.first_name,
          last_name: editedCustomer.last_name,
          password: editedCustomer.password,
          email: editedCustomer.email,
          shipping_address: editedCustomer.shipping_address,
          customer_name: editedCustomer.customer_name,
          role: editedCustomer.role,
          status: editedCustomer.status,
        };
        dispatch(setData(updatedCustomers));
        toast.success(response.data.message);
        setEditingCustomer(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing customer:" + error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/customers/${customerId}`);
      const updatedCustomers = data.filter(
        (customer) => customer._id !== customerId
      );
      dispatch(setData(updatedCustomers));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (customer) => {
    setSelectedCustomer(customer);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
    emailFilter,
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
        <Typography variant="h4">{t("Customers")}</Typography>
      </Stack>

      <Card>
        <CustomerTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          emailFilter={emailFilter}
          onEmailFilter={handleFilterByEmail}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "customer_image", label: t("Image") },
                  { id: "first_name", label: t("First Name") },
                  { id: "last_name", label: t("Last Name") },
                  { id: "email", label: t("Email Address") },
                  { id: "creation_date", label: t("Creation Date") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <CustomerTableRow
                        key={row._id}
                        customer_image={`${row.customer_image}`}
                        first_name={row.first_name}
                        last_name={row.last_name}
                        email={row.email}
                        creation_date={row.creation_date}
                        status={row.status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditCustomer(row)}
                        onDelete={(event) =>
                          openDeleteConfirmation(row._id, event)
                        }
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

      <CustomerDetailsPopup
        customer={selectedCustomer}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      {editingCustomer && (
        <EditCustomerForm
          customer={editingCustomer}
          onSave={handleSaveEditedCustomer}
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
        anchorEl={deleteConfirmationAnchorEl}
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
          {t("Are you sure you want to delete this element ?")}
        </Typography>
        <LoadingButton
          color="primary"
          loading={loadingDelete}
          onClick={() => {
            handleDeleteCustomer(selectedDeleteCustomerId);
            closeDeleteConfirmation();
          }}
        >
          {t("Confirm")}
        </LoadingButton>
        <Button color="secondary" onClick={closeDeleteConfirmation}>
          {t("Cancel")}
        </Button>
      </Popover>
    </Container>
  );
}
