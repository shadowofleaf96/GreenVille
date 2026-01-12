import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Iconify from "../../../components/iconify";

import createAxiosInstance from "../../../../utils/axiosConfig";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/subCategorySlice";
import Loader from "../../../../frontoffice/components/loader/Loader";

import SubCategoryTableToolbar from "../subcategory-table-toolbar";
import SubCategoryTableHead from "../subcategory-table-head";
import SubCategoryTableRow from "../subcategory-table-row";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import TableNoDataFilter from "../../../components/table/TableNoData";
import { applyFilter, emptyRows, getComparator } from "../utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import NewSubCategoryForm from "../new-subcategory-form";
import EditSubCategoryForm from "../subcategory-edit";

export default function SubCategoryView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const data = useSelector((state) => state.adminSubcategory.data);
  const loading = useSelector((state) => state.adminSubcategory.loading);
  const error = useSelector((state) => state.adminSubcategory.error);
  const filterName = useSelector((state) => state.adminSubcategory.filterName);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [openNewForm, setOpenNewForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteSubCategoryId, setSelectedDeleteSubCategoryId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const currentLanguage = i18n.language;
  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/subcategories");
      dispatch(setData(response.data.data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-red-500">
        {t("Error")}: {error.message}
      </p>
    );
  if (!data) return null;

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const openDeleteConfirmation = (id) => {
    setSelectedDeleteSubCategoryId(id);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteSubCategoryId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedDeleteSubCategoryId) return;
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(
        `/subcategories/${selectedDeleteSubCategoryId}`,
      );
      dispatch(
        setData(
          data.filter((item) => item._id !== selectedDeleteSubCategoryId),
        ),
      );
      toast.success(t("Deleted successfully"));
      closeDeleteConfirmation();
    } catch (err) {
      toast.error(t("Delete failed"));
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
    currentLanguage,
  }).filter((item) => {
    if (statusFilter !== "all") {
      return item.status === statusFilter;
    }
    return true;
  });

  const notFound = !dataFiltered.length;
  const emptyRowsCount = emptyRows(page, rowsPerPage, data.length);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Subcategories")}
        </h4>
        <Button
          onClick={() => setOpenNewForm(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify
            icon="material-symbols-light:add"
            className="mr-2"
            width={24}
            height={24}
          />
          {t("Add Subcategory")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <SubCategoryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => dispatch(setFilterName(e.target.value))}
          selected={selected}
          setSelected={setSelected}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusFilter={statusFilter}
          onStatusFilter={handleFilterStatus}
        />
        <ScrollArea className="w-full">
          <Table>
            <SubCategoryTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: "subcategory_name", label: t("Subcategory Name") },
                { id: "category", label: t("Category") },
                { id: "status", label: t("Status") },
                { id: "actions", label: "" },
              ]}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24">
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <SubCategoryTableRow
                        key={row._id}
                        selected={selected.indexOf(row._id) !== -1}
                        subcategory_image={row?.subcategory_image}
                        subcategory_name={row?.subcategory_name}
                        category={row?.category?.category_name}
                        status={row?.status}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => setEditing(row)}
                        onDelete={() => openDeleteConfirmation(row._id)}
                      />
                    ))}
                  {!notFound && (
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, data.length)}
                    />
                  )}
                  {notFound && (
                    <TableNoDataFilter
                      query={filterName}
                      colSpan={5}
                      resourceName="Subcategories"
                    />
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {/* Custom Pagination */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
          <div className="text-sm font-semibold text-gray-500">
            {t("Total")}:{" "}
            <span className="text-gray-900 font-bold">
              {dataFiltered.length}
            </span>{" "}
            {t("subcategories")}
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
                disabled={
                  page >= Math.ceil(dataFiltered.length / rowsPerPage) - 1
                }
                onClick={() => handlePageChange(page + 1)}
                className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
              >
                <Iconify icon="material-symbols:chevron-right" width={20} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <NewSubCategoryForm
        open={openNewForm}
        onClose={() => setOpenNewForm(false)}
        onSave={async (newData, file) => {
          const formData = new FormData();
          formData.append(
            "subcategory_name",
            JSON.stringify(newData.subcategory_name),
          );
          formData.append("category_id", newData.category_id);
          formData.append("status", newData.status);
          if (file) formData.append("subcategory_image", file);
          const response = await axiosInstance.post("/subcategories", formData);
          dispatch(setData([...data, response.data.data]));
          toast.success(t("Created successfully"));
        }}
      />

      {editing && (
        <EditSubCategoryForm
          subcategory={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onSave={async (editedData, file) => {
            const formData = new FormData();
            formData.append(
              "subcategory_name",
              JSON.stringify(editedData.subcategory_name),
            );
            formData.append("category_id", editedData.category_id);
            formData.append("status", editedData.status);
            if (file) formData.append("subcategory_image", file);
            const response = await axiosInstance.put(
              `/subcategories/${editing._id}`,
              formData,
            );
            const updated = data.map((item) =>
              item._id === editing._id
                ? { ...item, ...response.data.data }
                : item,
            );
            dispatch(setData(updated));
            toast.success(t("Updated successfully"));
            setEditing(null);
          }}
        />
      )}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
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
                "Are you sure you want to delete this subcategory? This action cannot be undone.",
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              disabled={loadingDelete}
              onClick={handleDelete}
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
