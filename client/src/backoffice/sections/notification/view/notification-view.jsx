import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import NotificationTableRow from "../notification-table-row";
import NotificationTableHead from "../notification-table-head";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import NotificationTableToolbar from "../notification-table-toolbar";
import SendNotificationForm from "../new-notification-form";
import NotificationDetailsPopup from "../notification-details";
import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/notificationSlice";
import Loader from "../../../../frontoffice/components/loader/Loader";
import createAxiosInstance from "../../../../utils/axiosConfig";

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

export default function NotificationView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const data = useSelector((state) => state.adminNotification.data);
  const error = useSelector((state) => state.adminNotification.error);
  const loading = useSelector((state) => state.adminNotification.loading);
  const filterName = useSelector((state) => state.adminNotification.filterName);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewNotificationFormOpen, setNewNotificationFormOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteNotificationId, setSelectedDeleteNotificationId] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(
        "/notifications/get-notifications",
      );
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

  const openDeleteConfirmation = (event, notificationId) => {
    setSelectedDeleteNotificationId(notificationId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteNotificationId(null);
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

  const handleDeleteNotification = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/notifications/${selectedDeleteNotificationId}`,
      );
      const updatedData = data.filter(
        (n) => n._id !== selectedDeleteNotificationId,
      );
      dispatch(setData(updatedData));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenDetailsPopup = (notification) => {
    setSelectedNotification(notification);
    setDetailsPopupOpen(true);
  };

  const handleSaveandSendNewNotification = async (newNotification) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.post(
        "/notifications/send-notification",
        newNotification,
      );
      const notificationdata = response.data.data;
      const AddedNotification = {
        key: notificationdata._id,
        _id: notificationdata._id,
        subject: newNotification.subject,
        body: newNotification.body,
        recipients: notificationdata.recipients,
        sendType: newNotification.sendType,
        dateSent: notificationdata.dateSent,
      };
      dispatch(setData([...data, AddedNotification]));
      toast.success(response.data.message);
      setNewNotificationFormOpen(false);
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleFilterType = (value) => {
    setTypeFilter(value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    currentLanguage,
  }).filter((item) => {
    if (typeFilter !== "all") {
      return item.sendType === typeFilter;
    }
    return true;
  });

  const notFound = !dataFiltered.length && !loading;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("notificationPage.title")}
        </h4>
        <Button
          onClick={() => setNewNotificationFormOpen(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify
            icon="material-symbols-light:send-outline-rounded"
            className="mr-2"
            width={24}
            height={24}
          />
          {t("Send Notification")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <NotificationTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            setSelected={setSelected}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            typeFilter={typeFilter}
            onTypeFilter={handleFilterType}
          />

          <Scrollbar>
            <Table>
              <NotificationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "subject", label: t("Subject") },
                  { id: "sendType", label: t("Notification Type") },
                  { id: "recipients", label: t("Recipients") },
                  { id: "dateSent", label: t("Date Sent") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
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
                        <NotificationTableRow
                          key={row._id}
                          subject={row.subject}
                          sendType={row.sendType}
                          recipients={row.recipients}
                          dateSent={row.dateSent}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={(event) => handleClick(event, row._id)}
                          onDelete={(event) =>
                            openDeleteConfirmation(event, row._id)
                          }
                          onDetails={() => handleOpenDetailsPopup(row)}
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
                        colSpan={6}
                        resourceName="Notifications"
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
              {t("notifications")}
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
                  <SelectTrigger className="w-[70px] bg-transparent border-none text-sm font-bold shadow-none focus:ring-0 text-gray-900">
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
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-primary min-w-[36px] text-center">
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

      <NotificationDetailsPopup
        notification={selectedNotification}
        open={isDetailsPopupOpen}
        onClose={() => {
          setDetailsPopupOpen(false);
          setSelectedNotification(null);
        }}
      />

      <SendNotificationForm
        open={isNewNotificationFormOpen}
        onSave={handleSaveandSendNewNotification}
        onCancel={() => setNewNotificationFormOpen(false)}
        onClose={() => setNewNotificationFormOpen(false)}
      />

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
              onClick={handleDeleteNotification}
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
