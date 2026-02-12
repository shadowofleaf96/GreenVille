"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "@/components/shared/iconify";
import Scrollbar from "@/admin/_components/scrollbar";
import TableNoDataFilter from "@/admin/_components/table/TableNoData";
import OrderTableRow from "../order-table-row";
import OrderTableHead from "../order-table-head";
import TableEmptyRows from "@/admin/_components/table/TableEmptyRows";
import OrderTableToolbar from "../order-table-toolbar";
import EditOrderForm from "../order-edit";
import OrderDetailsPopup from "../order-details";
import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "@/store/slices/admin/orderSlice";
import { fetchSettings } from "@/store/slices/admin/settingsSlice";
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

export default function OrderView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminOrder.data);
  const error = useSelector((state) => state.adminOrder.error);
  const loading = useSelector((state) => state.adminOrder.loading);
  const filterName = useSelector((state) => state.adminOrder.filterName);

  const [itemsFilter, setItemsFilter] = useState("");
  const [totalPriceFilter, setTotalPriceFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteOrderId, setSelectedDeleteOrderId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/orders");
      dispatch(setData(response.data.data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(fetchSettings());
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

  const openDeleteConfirmation = (event, orderId) => {
    setSelectedDeleteOrderId(orderId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteOrderId(null);
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

  const handleFilterByItems = (event) => {
    setItemsFilter(event.target.value);
    setPage(0);
  };

  const handleFilterByTotalPrice = (event) => {
    setTotalPriceFilter(event.target.value);
    setPage(0);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOpenModal(true);
  };

  const handleSaveEditedOrder = async (editedOrder) => {
    setLoadingDelete(true);
    try {
      const {
        _id,
        customer,
        status,
        cart_total_price,
        shipping_method,
        shipping_status,
        order_notes,
        shipping_address,
        delivery_boy_id,
      } = editedOrder;
      const { _id: customer_id, first_name, last_name, email } = customer;

      const customer_name =
        first_name || last_name
          ? `${first_name || ""} ${last_name || ""}`.trim()
          : email || "Unknown Customer";

      const payload = {
        customer_id,
        customer_name,
        status,
        cart_total_price,
        shipping_status,
        shipping_method,
        shipping_address,
        order_notes,
        delivery_boy_id,
      };

      const response = await axiosInstance.put(`/orders/${_id}`, payload);

      const index = data.findIndex((order) => order._id === _id);
      if (index !== -1) {
        const updatedOrders = [...data];
        updatedOrders[index] = response.data.data;
        dispatch(setData(updatedOrders));
        toast.success(response.data.message);
        setEditingOrder(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing order:", error);
      toast.error(error.response?.data.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDeleteOrder = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/orders/${selectedDeleteOrderId}`,
      );
      const updatedOrders = data.filter(
        (order) => order._id !== selectedDeleteOrderId,
      );
      dispatch(setData(updatedOrders));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenDetailsPopup = (order) => {
    setSelectedOrder(order);
    setDetailsPopupOpen(true);
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    itemsFilter,
    totalPriceFilter,
  });

  const notFound = !dataFiltered.length && !loading;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Orders")}
        </h4>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
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
          />

          <Scrollbar>
            <Table>
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "id", label: t("Order ID") },
                  { id: "customer", label: t("Customer Name") },
                  { id: "order_items", label: t("Order Items") },
                  { id: "cart_total_price", label: t("Cart Total Price") },
                  { id: "order_date", label: t("Order Date") },
                  { id: "shipping_method", label: t("Shipping Method") },
                  { id: "shipping_status", label: t("Shipping Status") },
                  { id: "delivery_boy", label: t("Delivery Boy") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24">
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
                      .map((row) => {
                        const orderItemsArray = Object.values(row.order_items);
                        return (
                          <OrderTableRow
                            key={row._id}
                            id={row._id}
                            customer={row.customer}
                            order_items={orderItemsArray}
                            cart_total_price={row.cart_total_price}
                            order_date={row.order_date}
                            shipping_method={row.shipping_method}
                            shipping_status={row.shipping_status}
                            shipping_address={row.shipping_address}
                            shipping_price={row.shipping_price}
                            tax={row.tax}
                            coupon_discount={row.coupon_discount}
                            status={row.status}
                            delivery_boy={row.delivery_boy}
                            selected={selected.indexOf(row._id) !== -1}
                            handleClick={(event) => handleClick(event, row._id)}
                            onEdit={() => handleEditOrder(row)}
                            onDelete={(event) =>
                              openDeleteConfirmation(event, row._id)
                            }
                            onDetails={() => handleOpenDetailsPopup(row)}
                          />
                        );
                      })}

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
                        colSpan={10}
                        resourceName="Orders"
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
              {t("orders")}
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

      <OrderDetailsPopup
        order={selectedOrder}
        open={isDetailsPopupOpen}
        onClose={() => setDetailsPopupOpen(false)}
      />

      {editingOrder && (
        <EditOrderForm
          order={editingOrder}
          onSave={handleSaveEditedOrder}
          onCancel={() => {
            setEditingOrder(null);
            setOpenModal(false);
          }}
          open={openModal}
          onClose={() => {
            setEditingOrder(null);
            setOpenModal(false);
          }}
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
              onClick={handleDeleteOrder}
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
