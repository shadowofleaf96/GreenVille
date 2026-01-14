import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import CouponTableRow from "../coupon-table-row";
import CouponTableHead from "../coupon-table-head";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import CouponTableToolbar from "../coupon-table-toolbar";
import EditCouponForm from "../coupon-edit";
import NewCouponForm from "../new-coupon-form";
import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/couponSlice";
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

export default function CouponView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const data = useSelector((state) => state.adminCoupon.data);
  const error = useSelector((state) => state.adminCoupon.error);
  const loading = useSelector((state) => state.adminCoupon.loading);
  const filterName = useSelector((state) => state.adminCoupon.filterName);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewCouponFormOpen, setNewCouponFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteCouponId, setSelectedDeleteCouponId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/coupons");
      dispatch(setData(response?.data?.data));
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

  const openDeleteConfirmation = (event, couponId) => {
    setSelectedDeleteCouponId(couponId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteCouponId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setOpenModal(true);
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

  const handleDeleteCoupon = async () => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(
        `/coupons/${selectedDeleteCouponId}`,
      );
      const updatedCoupons = data.filter(
        (coupon) => coupon._id !== selectedDeleteCouponId,
      );
      dispatch(setData(updatedCoupons));
      toast.success(response.data.message);
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(t("Error deleting coupon"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSaveEditedCoupon = async (editedCoupon) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/coupons/${editedCoupon._id}`,
        editedCoupon,
      );

      const index = data.findIndex((c) => c._id === editedCoupon._id);
      if (index !== -1) {
        const updatedCoupons = [...data];
        updatedCoupons[index] = {
          ...updatedCoupons[index],
          ...editedCoupon,
        };
        dispatch(setData(updatedCoupons));
        toast.success(response.data.message);
        setEditingCoupon(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing coupon:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSaveNewCoupon = async (newCoupon) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.post("/coupons/create", newCoupon);
      const coupondata = response.data.data;
      dispatch(setData([...data, coupondata]));
      toast.success(response.data.message);
      setNewCouponFormOpen(false);
    } catch (error) {
      console.error("Error creating new coupon:", error);
      toast.error(error.response?.data?.message || t("An error occurred"));
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
          {t("Coupons")}
        </h4>
        <Button
          onClick={() => setNewCouponFormOpen(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify
            icon="material-symbols-light:add"
            className="mr-2"
            width={24}
            height={24}
          />
          {t("Add Coupon")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <CouponTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            setSelected={setSelected}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            onStatusFilter={handleFilterStatus}
          />

          <Scrollbar>
            <Table>
              <CouponTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "code", label: t("Coupon Code") },
                  { id: "discount", label: t("Discount (%)") },
                  { id: "expiresAt", label: t("Expires At") },
                  { id: "usageLimit", label: t("Usage Limit") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24">
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
                        <CouponTableRow
                          key={row._id}
                          code={row.code}
                          discount={row.discount}
                          expiresAt={new Date(
                            row.expiresAt,
                          ).toLocaleDateString()}
                          usageLimit={row.usageLimit}
                          status={row.status}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={(event) => handleClick(event, row._id)}
                          onEdit={() => handleEditCoupon(row)}
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
                        colSpan={7}
                        resourceName="Coupons"
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
              {t("coupons")}
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

      <NewCouponForm
        open={isNewCouponFormOpen}
        onSave={handleSaveNewCoupon}
        onCancel={() => setNewCouponFormOpen(false)}
        onClose={() => setNewCouponFormOpen(false)}
      />

      {editingCoupon && (
        <EditCouponForm
          coupon={editingCoupon}
          onSave={handleSaveEditedCoupon}
          onCancel={() => {
            setEditingCoupon(null);
            setOpenModal(false);
          }}
          open={openModal}
          onClose={() => {
            setEditingCoupon(null);
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
              onClick={handleDeleteCoupon}
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
