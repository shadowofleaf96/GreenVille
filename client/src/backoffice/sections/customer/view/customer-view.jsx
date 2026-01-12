import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import CustomerTableRow from "../customer-table-row";
import CustomerTableHead from "../customer-table-head";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import CustomerTableToolbar from "../customer-table-toolbar";
import EditCustomerForm from "../customer-edit";
import CustomerDetailsPopup from "../customer-details";
import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/customerSlice";
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

export default function CustomerView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
  const [orderBy, setOrderBy] = useState("first_name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [selectedDeleteCustomerId, setSelectedDeleteCustomerId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/customers");
      dispatch(setData(response.data.data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
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
      setPage(0);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataFiltered.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
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

  const openDeleteConfirmation = (customerId) => {
    setSelectedDeleteCustomerId(customerId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setSelectedDeleteCustomerId(null);
  };

  const handleDeleteCustomer = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/customers/${selectedDeleteCustomerId}`,
      );
      const updatedCustomers = data.filter(
        (customer) => customer._id !== selectedDeleteCustomerId,
      );
      dispatch(setData(updatedCustomers));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(t("Error deleting customer"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleFilterByEmail = (event) => {
    setEmailFilter(event.target.value);
    setPage(0);
  };

  const handleSaveEditedCustomer = async (editedCustomer, selectedImage) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("first_name", editedCustomer.first_name);
      formData.append("last_name", editedCustomer.last_name);
      if (editedCustomer.password)
        formData.append("password", editedCustomer.password);
      formData.append("email", editedCustomer.email);
      formData.append("status", editedCustomer.status);

      if (editedCustomer.shipping_address) {
        Object.entries(editedCustomer.shipping_address).forEach(
          ([key, value]) => {
            formData.append(`shipping_address[${key}]`, value);
          },
        );
      }

      if (selectedImage) {
        formData.append("customer_image", selectedImage);
      }

      const response = await axiosInstance.put(
        `/customers/${editedCustomer._id}`,
        formData,
      );

      const index = data.findIndex((c) => c._id === editedCustomer._id);
      if (index !== -1) {
        const updatedCustomers = [...data];
        updatedCustomers[index] = response.data.data;
        dispatch(setData(updatedCustomers));
        toast.success(response.data.message);
        setOpenModal(false);
        setEditingCustomer(null);
      }
    } catch (error) {
      console.error("Error editing customer:", error);
      toast.error(t("Error updating customer"));
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
    comparator: getComparator(order, orderBy),
    filterName,
    emailFilter,
  }).filter((item) => {
    if (statusFilter !== "all") {
      return item.status === statusFilter;
    }
    return true;
  });

  const notFound = !dataFiltered.length && !loading;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Customers")}
        </h4>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <CustomerTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              dispatch(setFilterName(e.target.value));
              setPage(0);
            }}
            emailFilter={emailFilter}
            onEmailFilter={handleFilterByEmail}
            selected={selected}
            setSelected={setSelected}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            onStatusFilter={handleFilterStatus}
          />

          <Scrollbar>
            <Table>
              <CustomerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
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
                  { id: "" },
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
                        <CustomerTableRow
                          key={row._id}
                          customer_image={row.customer_image}
                          first_name={row.first_name}
                          last_name={row.last_name}
                          email={row.email}
                          creation_date={row.creation_date}
                          status={row.status}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={() => handleClick(row._id)}
                          onEdit={() => handleEditCustomer(row)}
                          onDelete={() => openDeleteConfirmation(row._id)}
                          onDetails={() => {
                            setSelectedCustomer(row);
                            setDetailsPopupOpen(true);
                          }}
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
                        resourceName="Customers"
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
              {t("customers")}
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
                  <SelectTrigger className="w-[70px] bg-transparent border-none text-sm font-bold shadow-none focus:ring-0">
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

      {/* Customer Details Popup */}
      <CustomerDetailsPopup
        customer={selectedCustomer}
        open={isDetailsPopupOpen}
        onClose={() => setDetailsPopupOpen(false)}
      />

      {/* Edit Customer Form */}
      {editingCustomer && (
        <EditCustomerForm
          customer={editingCustomer}
          onSave={handleSaveEditedCustomer}
          onCancel={() => {
            setEditingCustomer(null);
            setOpenModal(false);
          }}
          open={openModal}
          onClose={() => {
            setEditingCustomer(null);
            setOpenModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl">
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
              onClick={handleDeleteCustomer}
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
