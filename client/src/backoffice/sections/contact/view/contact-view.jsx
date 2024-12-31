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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify/index.js";
import Scrollbar from "../../../components/scrollbar/index.js";

import TableNoDataFilter from "../table-no-data.jsx";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactTableRow from "../contact-table-row.jsx";
import ContactTableHead from "../contact-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import ContactTableToolbar from "../contact-table-toolbar.jsx";
import EditContactForm from "../contact-edit.jsx";
import ReplyContactForm from "../reply-contact-form.jsx";


import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/contactSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";

// ----------------------------------------------------------------------

export default function ContactView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const data = useSelector((state) => state.adminContact.data);
  const error = useSelector((state) => state.adminContact.error);
  const loading = useSelector((state) => state.adminContact.loading);
  const filterName = useSelector((state) => state.adminContact.filterName);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [replyingContact, setReplyingContact] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewContactFormOpen, setNewContactFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteContactId, setSelectedDeleteContactId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance("admin")
  const currentLanguage = i18n.language;

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/contact");
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

  const openDeleteConfirmation = (event, contactId) => {
    setSelectedDeleteContactId(contactId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteContactId(null);
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

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setOpenModal(true);
  };


  const handleSaveEditedContact = async (editedContact) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/contact/${editedContact._id}`,
        editedContact
      );

      const index = data.findIndex(
        (contact) => contact._id === editedContact._id
      );

      if (index !== -1) {
        const updatedContacts = [...data];
        updatedContacts[index] = {
          ...updatedContacts[index],
          name: editedContact.name,
          email: editedContact.email,
          phone_number: editedContact.phone_number,
          message: editedContact.message
        };
        dispatch(setData(updatedContacts));
        toast.success(response.data.message);
        setEditingContact(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing contact:" + error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleReplyingContact = async (replyingContact) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.post(
        `/contact/reply`,
        replyingContact
      );

      toast.success(response.data.message);
      setReplyingContact(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Error replying to contact:" + error);
      toast.error("Error: " + error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleReplyContact = (contact) => {
    setReplyingContact(contact);
    setOpenModal(true);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleCancelReply = () => {
    setReplyingContact(null);
  };

  const handleDeleteContact = async (contactId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/contact/${contactId}`);
      const updatedContacts = data.filter(
        (contact) => contact._id !== contactId
      );
      dispatch(setData(updatedContacts));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
    currentLanguage
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
        <Typography variant="h4">{t("Contact")}</Typography>
      </Stack>

      <Card>
        <ContactTableToolbar
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
              <ContactTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "name", label: t("Contact Name") },
                  { id: "email", label: t("Contact Email") },
                  { id: "phone_number", label: t("Contact Phone Number") },
                  { id: "message", label: t("Contact Message") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <ContactTableRow
                        key={row._id}
                        name={row.name}
                        email={row.email}
                        phone_number={row.phone_number}
                        message={row.message}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditContact(row)}
                        onReply={() => handleReplyContact(row)}
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
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={t("Rows per page:")}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {editingContact && (
        <EditContactForm
          contact={editingContact}
          onSave={handleSaveEditedContact}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {replyingContact && (
        <ReplyContactForm
          contact={replyingContact}
          onSave={handleReplyingContact}
          onCancel={handleCancelReply}
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
          {t("Are you sure you want to delete this element ?")}
        </Typography>
        <LoadingButton
          color="primary"
          loading={loadingDelete}
          onClick={() => {
            handleDeleteContact(selectedDeleteContactId);
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
