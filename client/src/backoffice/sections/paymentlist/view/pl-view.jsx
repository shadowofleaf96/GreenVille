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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import TableNoDataFilter from "../table-no-data";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentListTableRow from "../pl-table-row";
import PaymentListTableHead from "../pl-table-head";
import TableEmptyRows from "../table-empty-rows";
import PaymentListTableToolbar from "../pl-table-toolbar";
import EditPaymentListForm from "../pl-edit";
import NewPaymentListForm from "../new-pl-form";
import PaymentListDetailsPopup from "../pl-details";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/paymentListSlice.js";

// ----------------------------------------------------------------------

export default function PaymentListPage() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.paymentList.data);
  const error = useSelector((state) => state.paymentList.error);
  const loading = useSelector((state) => state.paymentList.loading);
  const filterName = useSelector((state) => state.paymentList.filterName);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingPaymentList, setEditingPaymentList] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPaymentList, setSelectedPaymentList] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isNewPaymentListFormOpen, setNewPaymentListFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeletePaymentListId, setSelectedDeletePaymentListId] =
    useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      // Use axios to fetch data
      const response = await axios.get("/v1/paymentLists");
      const data = response.data.paymentList;

      // Update the state with the fetched data
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

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Adjust this if needed
  };

  if (loading) {
    return (
      <Stack style={containerStyle}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Typography variant="body2">Error : {error.message} </Typography>;
  }

  // Render CircularProgress only when data is null
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

  const openDeleteConfirmation = (paymentListId) => {
    setSelectedDeletePaymentListId(paymentListId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeletePaymentListId(null);
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

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditPaymentList = (paymentList) => {
    setEditingPaymentList(paymentList);
    setOpenModal(true);
  };

  const handleSaveEditedPaymentList = async (
    editedPaymentList,
    selectedImage
  ) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("paymentList_image", selectedImage);
      formData.append("first_name", editedPaymentList.first_name);
      formData.append("last_name", editedPaymentList.last_name);
      formData.append("password", editedPaymentList.password);
      formData.append("email", editedPaymentList.email);
      formData.append("paymentList_name", editedPaymentList.paymentList_name);
      formData.append("role", editedPaymentList.role);
      formData.append("active", editedPaymentList.active);

      const response = await axios.put(
        `/v1/paymentLists/${editedPaymentList._id}`,
        formData
      );

      const index = data.findIndex(
        (paymentList) => paymentList._id === editedPaymentList._id
      );

      if (index !== -1) {
        const updatedPaymentLists = [...data];
        updatedPaymentLists[index] = {
          ...updatedPaymentLists[index],
          paymentList_image: "images/" + selectedImage.name,
          first_name: editedPaymentList.first_name,
          last_name: editedPaymentList.last_name,
          password: editedPaymentList.password,
          email: editedPaymentList.email,
          paymentList_name: editedPaymentList.paymentList_name,
          role: editedPaymentList.role,
          active: editedPaymentList.active,
        };
        dispatch(setData(updatedPaymentLists));
        openSnackbar(response.data.message);
        setEditingPaymentList(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing paymentList:" + error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPaymentList(null); // Close the edit form
  };

  //-------Delete paymentList---
  const handleDeletePaymentList = async (paymentListId) => {
    setLoadingDelete(true);
    try {
      console.log(paymentListId);
      const response = await axios.delete(`/v1/paymentLists/${paymentListId}`);
      const updatedPaymentLists = data.filter(
        (paymentList) => paymentList._id !== paymentListId
      );
      dispatch(setData(updatedPaymentLists));
      openSnackbar(response.data.message);
    } catch (error) {
      console.error("Error deleting paymentList:", error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (paymentList) => {
    setSelectedPaymentList(paymentList);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewPaymentListForm = () => {
    setNewPaymentListFormOpen(true);
  };

  const handleCloseNewPaymentListForm = () => {
    setNewPaymentListFormOpen(false);
  };

  const handleSaveNewPaymentList = async (newPaymentList, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("paymentList_image", selectedImage);
      formData.append("sku", newPaymentList.sku);
      formData.append("paymentList_name", newPaymentList.paymentList_name);
      formData.append("short_description", newPaymentList.short_description);
      formData.append("subcategory_id", newPaymentList.subcategory_id);
      formData.append("price", newPaymentList.price);
      formData.append("discount_price", newPaymentList.discount_price);
      formData.append("option", newPaymentList.option);
      formData.append("active", newPaymentList.active);

      // Make API call to create a new paymentList
      const response = await axios.post("/v1/paymentLists", formData);
      const paymentListdata = response.data.paymentList;
      selectedImage.name;
      // Dispatch the action to update the Redux state
      const AddedPaymentLists = {
        key: paymentListdata._id,
        _id: paymentListdata._id,
        paymentList_image: "images/" + selectedImage.name,
        sku: newPaymentList.sku,
        paymentList_name: newPaymentList.paymentList_name,
        short_description: newPaymentList.short_description,
        subcategory_id: newPaymentList.subcategory_id,
        price: newPaymentList.price,
        discount_price: newPaymentList.discount_price,
        option: newPaymentList.option,
        active: newPaymentList.active,
        creation_date: paymentListdata.creation_date,
      };

      dispatch(setData([...data, AddedPaymentLists]));
      openSnackbar(response.data.message);

      // Optionally, update the paymentLists state or perform any other necessary actions
    } catch (error) {
      console.error("Error creating new paymentList:", error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      handleCloseNewPaymentListForm();
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
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
        <Typography variant="h4">PaymentLists</Typography>
        <Button
          variant="contained"
          onClick={handleOpenNewPaymentListForm}
          color="inherit"
          startIcon={
            <Iconify
              icon="material-symbols-light:add"
            />
          }
        >
          New PaymentList
        </Button>
      </Stack>

      <Card>
        <PaymentListTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <PaymentListTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "paymentList_image", label: "Image" },
                  { id: "sku", label: "SKU" },
                  { id: "paymentList_name", label: "PaymentList Name" },
                  { id: "price", label: "Price" },
                  { id: "option", label: "Options" },
                  { id: "creation_date", label: "Creation Date" },
                  { id: "active", label: "Active" },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <PaymentListTableRow
                        key={row._id}
                        paymentList_image={`http://localhost:3000/${row.paymentList_image}`}
                        sku={row.sku}
                        paymentList_name={row.paymentList_name}
                        price={row.price}
                        option={row.option}
                        creation_date={row.creation_date}
                        active={row.active}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditPaymentList(row)}
                        onDelete={() => openDeleteConfirmation(row._id)}
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
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <NewPaymentListForm
        open={isNewPaymentListFormOpen}
        onSave={handleSaveNewPaymentList}
        onCancel={handleCloseNewPaymentListForm}
        onClose={handleCloseNewPaymentListForm}
      />

      <PaymentListDetailsPopup
        paymentList={selectedPaymentList}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      {editingPaymentList && (
        <EditPaymentListForm
          paymentList={editingPaymentList}
          onSave={handleSaveEditedPaymentList}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
      <Popover
        anchorEl={isDeleteConfirmationOpen}
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 250,
            p: 2,
          },
        }}
      >
        <Typography sx={{ mb: 1 }} component="div" variant="subtitle1">
          Are you sure you want to delete this paymentList ?
        </Typography>
        <LoadingButton
          color="primary"
          loading={loadingDelete}
          onClick={() => {
            handleDeletePaymentList(selectedDeletePaymentListId);
            closeDeleteConfirmation();
          }}
        >
          Confirm
        </LoadingButton>
        <Button onClick={closeDeleteConfirmation}>Cancel</Button>
      </Popover>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000} // Adjust as needed
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={
            typeof snackbarMessage === "string" &&
            snackbarMessage.includes("Error")
              ? "error"
              : "success"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
