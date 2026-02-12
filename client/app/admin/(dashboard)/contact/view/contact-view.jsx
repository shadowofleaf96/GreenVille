"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "@/components/shared/iconify";
import Scrollbar from "@/admin/_components/scrollbar";
import TableNoDataFilter from "@/admin/_components/table/TableNoData";
import ContactTableRow from "../contact-table-row";
import ContactTableHead from "../contact-table-head";
import TableEmptyRows from "@/admin/_components/table/TableEmptyRows";
import ContactTableToolbar from "../contact-table-toolbar";
import EditContactForm from "../contact-edit";
import ReplyContactForm from "../reply-contact-form";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "@/store/slices/admin/contactSlice";
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

export default function ContactView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const data = useSelector((state) => state.adminContact.data);
  const error = useSelector((state) => state.adminContact.error);
  const loading = useSelector((state) => state.adminContact.loading);
  const filterName = useSelector((state) => state.adminContact.filterName);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [replyingContact, setReplyingContact] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteContactId, setSelectedDeleteContactId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const axiosInstance = createAxiosInstance("admin");
  const currentLanguage = i18n.language;

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/contact");
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

  const openDeleteConfirmation = (event, contactId) => {
    setSelectedDeleteContactId(contactId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteContactId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleFilterByName = (event) => {
    dispatch(setFilterName(event.target.value));
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
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
        editedContact,
      );

      const index = data.findIndex((c) => c._id === editedContact._id);
      if (index !== -1) {
        const updatedContacts = [...data];
        updatedContacts[index] = {
          ...updatedContacts[index],
          ...editedContact,
        };
        dispatch(setData(updatedContacts));
        toast.success(response.data.message);
        setEditingContact(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing contact:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleReplyingContact = async (replyingContact) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.post(
        `/contact/reply`,
        replyingContact,
      );
      toast.success(response.data.message);
      setReplyingContact(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Error replying to contact:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleReplyContact = (contact) => {
    setReplyingContact(contact);
    setOpenModal(true);
  };

  const handleDeleteContact = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/contact/${selectedDeleteContactId}`,
      );
      const updatedContacts = data.filter(
        (c) => c._id !== selectedDeleteContactId,
      );
      dispatch(setData(updatedContacts));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    currentLanguage,
  });

  const notFound = !dataFiltered.length && !loading;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Contact")}
        </h4>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <ContactTableToolbar
            numSelected={selected.length}
            selected={selected}
            setSelected={setSelected}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <Table>
              <ContactTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
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
                        colSpan={6}
                        resourceName="Messages"
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
              {t("contacts")}
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

      {editingContact && (
        <EditContactForm
          contact={editingContact}
          onSave={handleSaveEditedContact}
          onCancel={() => setEditingContact(null)}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {replyingContact && (
        <ReplyContactForm
          contact={replyingContact}
          onSave={handleReplyingContact}
          onCancel={() => setReplyingContact(null)}
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
            <DialogTitle className="text-2xl font-bold text-gray-900 uppercase">
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
              onClick={handleDeleteContact}
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
