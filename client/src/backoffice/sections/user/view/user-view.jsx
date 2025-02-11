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
import { useTranslation } from "react-i18next";
import Fab from "@mui/material/Fab";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import TableNoDataFilter from "../table-no-data";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserTableRow from "../user-table-row";
import UserTableHead from "../user-table-head";
import TableEmptyRows from "../table-empty-rows";
import UserTableToolbar from "../user-table-toolbar";
import EditUserForm from "../user-edit";
import NewUserForm from "../new-user-form";
import UserDetailsPopup from "../user-details";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/userSlice";
import Loader from "../../../../frontoffice/components/loader/Loader";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
const backend = import.meta.env.VITE_BACKEND_URL;


// ----------------------------------------------------------------------

export default function UserView() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminUser.data);
  const error = useSelector((state) => state.adminUser.error);
  const loading = useSelector((state) => state.adminUser.loading);
  const filterName = useSelector((state) => state.adminUser.filterName);
  const [emailFilter, setEmailFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isNewUserFormOpen, setNewUserFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmationAnchorEl, setDeleteConfirmationAnchorEl] =
    useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { admin } = useSelector((state) => state.adminAuth);
  const { t } = useTranslation();
  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/users")
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

  const openDeleteConfirmation = (userId, event) => {
    setSelectedDeleteUserId(userId);
    setDeleteConfirmationAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteUserId(null);
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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleSaveEditedUser = async (editedUser, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("first_name", editedUser.first_name);
      formData.append("last_name", editedUser.last_name);
      formData.append("password", editedUser.password);
      formData.append("email", editedUser.email);
      formData.append("user_name", editedUser.user_name);
      formData.append("role", editedUser.role);
      formData.append("status", editedUser.status);

      if (selectedImage) {
        formData.append("user_image", selectedImage);
      }

      const response = await axiosInstance.put(`/users/${editedUser._id}`, formData);

      const index = data.findIndex((user) => user._id === editedUser._id);

      if (index !== -1) {
        const updatedUsers = [...data];
        const userData = response.data.data;
        updatedUsers[index] = {
          ...updatedUsers[index],
          user_image: userData.user_image,
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          password: editedUser.password,
          email: editedUser.email,
          user_name: editedUser.user_name,
          role: editedUser.role,
          status: editedUser.status,
        };

        dispatch(setData(updatedUsers));
        toast.success(response.data.message);
        setEditingUser(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing user:" + error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      const updatedUsers = data.filter((user) => user._id !== userId);
      dispatch(setData(updatedUsers));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (user) => {
    setSelectedUser(user);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewUserForm = () => {
    setNewUserFormOpen(true);
  };

  const handleCloseNewUserForm = () => {
    setNewUserFormOpen(false);
  };

  const handleSaveNewUser = async (newUser, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("first_name", newUser.first_name);
      formData.append("last_name", newUser.last_name);
      formData.append("password", newUser.password);
      formData.append("email", newUser.email);
      formData.append("user_name", newUser.user_name);
      formData.append("role", newUser.role);
      formData.append("status", newUser.status);

      if (selectedImage) {
        formData.append("user_image", selectedImage);
        newUser.user_image = "images/" + selectedImage.name;
      } else {
        newUser.user_image = "images/image_placeholder.webp";
      }

      const response = await axiosInstance.post("/users", formData);
      const userdata = response.data.data;
      const AddedUsers = {
        key: userdata._id,
        _id: userdata._id,
        user_image: userdata.user_image,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        password: newUser.password,
        email: newUser.email,
        user_name: newUser.user_name,
        role: newUser.role,
        status: newUser.status,
        creation_date: userdata.creation_date,
      };

      dispatch(setData([...data, AddedUsers]));
      toast.success(response.data.message);

    } catch (error) {
      console.error("Error creating new user:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      handleCloseNewUserForm();
      setLoadingDelete(false);
    }
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
        <Typography variant="h4">{t("Users")}</Typography>
        {admin?.role !== "manager" && (
          <Fab
            variant="contained"
            onClick={handleOpenNewUserForm}
            color="primary"
            aria-label="add"
          >
            <Iconify icon="material-symbols-light:add" width={36} height={36} />
          </Fab>
        )}
      </Stack>

      <Card>
        <UserTableToolbar
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
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "user_image", label: t("Image") },
                  { id: "first_name", label: t("First Name") },
                  { id: "last_name", label: t("Last Name") },
                  { id: "role", label: t("Role") },
                  { id: "user_name", label: t("User Name") },
                  { id: "creation_date", label: t("Creation Date") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      user_image={`${row.user_image}`}
                      first_name={row.first_name}
                      last_name={row.last_name}
                      role={row.role}
                      user_name={row.user_name}
                      creation_date={row.creation_date}
                      status={row.status}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onEdit={() => handleEditUser(row)}
                      onDelete={(event) =>
                        openDeleteConfirmation(row._id, event)
                      }
                      onDetails={() => handleOpenDetailsPopup(row)}
                    />
                  ))}
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

      <NewUserForm
        open={isNewUserFormOpen}
        onSave={handleSaveNewUser}
        onCancel={handleCloseNewUserForm}
        onClose={handleCloseNewUserForm}
      />

      <UserDetailsPopup
        user={selectedUser}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSave={handleSaveEditedUser}
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
            handleDeleteUser(selectedDeleteUserId);
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
