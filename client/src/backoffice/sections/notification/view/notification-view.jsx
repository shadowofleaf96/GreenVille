import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import { useTranslation } from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import NotificationDetailsPopup from "../notification-details.jsx";
import Snackbar from "@mui/material/Snackbar";
import Fab from "@mui/material/Fab";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";

import Iconify from "../../../components/iconify/index.js";
import Scrollbar from "../../../components/scrollbar/index.js";

import TableNoDataFilter from "../table-no-data.jsx";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationTableRow from "../notification-table-row.jsx";
import NotificationTableHead from "../notification-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import NotificationTableToolbar from "../notification-table-toolbar.jsx";
import SendNotificationForm from "../new-notification-form.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/notificationSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function NotificationView() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminNotification.data);
  const error = useSelector((state) => state.adminNotification.error);
  const loading = useSelector((state) => state.adminNotification.loading);
  const filterName = useSelector((state) => state.adminNotification.filterName);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNewNotificationFormOpen, setNewNotificationFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteNotificationId, setSelectedDeleteNotificationId] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { t, i18n } = useTranslation();
  const axiosInstance = createAxiosInstance("admin");
  const currentLanguage = i18n.language;

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/notifications/get-notifications");
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

  const openDeleteConfirmation = (event, notificationId) => {
    setSelectedDeleteNotificationId(notificationId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteNotificationId(null);
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

  const handleDeleteNotification = async (notificationId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
      const updatedNotifications = data.filter(
        (notification) => notification._id !== notificationId
      );
      dispatch(setData(updatedNotifications));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (notification) => {
    setSelectedNotification(notification);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewNotificationForm = () => {
    setNewNotificationFormOpen(true);
  };

  const handleCloseNewNotificationForm = () => {
    setNewNotificationFormOpen(false);
  };

  const handleSaveandSendNewNotification = async (newNotification) => {
    setLoadingDelete(true);

    try {
      const response = await axiosInstance.post("/notifications/send-notification", newNotification);
      const notificationdata = response.data.data;
      const AddedNotification = {
        key: notificationdata._id,
        _id: notificationdata._id,
        subject: newNotification.subject,
        body: newNotification.body,
        recipients: notificationdata.recipients,
        sendType: newNotification.sendType,
        dateSent: notificationdata.dateSent
      };

      dispatch(setData([...data, AddedNotification]));
      toast.success(response.data.message);
      
    } catch (error) {
      console.error("Error creating new notification:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      handleCloseNewNotificationForm();
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
        <Typography variant="h4">{t("notificationPage.title")}</Typography>
        <Fab
          variant="contained"
          onClick={handleOpenNewNotificationForm}
          color="primary"
          aria-label="add"
        >
          <Iconify icon="material-symbols-light:send-outline-rounded" width={36} height={36} />
        </Fab>
      </Stack>

      <Card>
        <NotificationTableToolbar
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
              <NotificationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "subject", label: t("Subject"), },
                  { id: "sendType", label: t("Notification Type") },
                  { id: "recipients", label: t("Recipients") },
                  { id: "dateSent", label: t("Date Sent") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <NotificationTableRow
                        key={row._id}
                        subject={row.subject}
                        sendType={row.sendType}
                        recipients={row.recipients}
                        dateSent={row.dateSent}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
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
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={t("Rows per page:")}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <NotificationDetailsPopup
        notification={selectedNotification}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      <SendNotificationForm
        open={isNewNotificationFormOpen}
        onSave={handleSaveandSendNewNotification}
        onCancel={handleCloseNewNotificationForm}
        onClose={handleCloseNewNotificationForm}
      />

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
            handleDeleteNotification(selectedDeleteNotificationId);
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
