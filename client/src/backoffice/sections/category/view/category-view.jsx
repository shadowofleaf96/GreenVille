import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import CategoryTableRow from "../category-table-row";
import CategoryTableHead from "../category-table-head";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import CategoryTableToolbar from "../category-table-toolbar";
import EditCategoryForm from "../category-edit";
import AddCategoryForm from "../new-category-form";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/categorySlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";

export default function CategoryView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const data = useSelector((state) => state.adminCategory.data);
  const error = useSelector((state) => state.adminCategory.error);
  const loading = useSelector((state) => state.adminCategory.loading);
  const filterName = useSelector((state) => state.adminCategory.filterName);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [orderBy, setOrderBy] = useState("category_name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewCategoryFormOpen, setNewCategoryFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteCategoryId, setSelectedDeleteCategoryId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const currentLanguage = i18n.language;

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/categories");
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const openDeleteConfirmation = (event, categoryId) => {
    setSelectedDeleteCategoryId(categoryId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteCategoryId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      const updatedData = data.filter((item) => item._id !== categoryId);
      dispatch(setData(updatedData));
      toast.success(t("categoryPage.deleteSuccess"));
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(t("categoryPage.deleteError"));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSaveNewCategory = async (newCategory, imageFile) => {
    try {
      const formData = new FormData();
      formData.append(
        "category_name",
        JSON.stringify(newCategory.category_name),
      );
      formData.append("status", newCategory.status);
      if (imageFile) {
        formData.append("category_image", imageFile);
      }

      const response = await axiosInstance.post("/categories", formData);
      dispatch(setData([...data, response.data.data]));
      toast.success(t("categoryPage.createSuccess"));
      setNewCategoryFormOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(t("categoryPage.createError"));
    }
  };

  const handleSaveEditedCategory = async (editedCategory, imageFile) => {
    try {
      const formData = new FormData();
      formData.append(
        "category_name",
        JSON.stringify(editedCategory.category_name),
      );
      formData.append("status", editedCategory.status);
      if (imageFile) {
        formData.append("category_image", imageFile);
      }

      const response = await axiosInstance.put(
        `/categories/${editedCategory._id}`,
        formData,
      );

      const updatedData = data.map((item) =>
        item._id === editedCategory._id ? response.data.data : item,
      );
      dispatch(setData(updatedData));
      toast.success(t("categoryPage.updateSuccess"));
      setOpenModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(t("categoryPage.updateError"));
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setOpenModal(false);
  };

  const handleFilterStatus = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    dispatch(setFilterName(event.target.value));
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

  const handleOpenNewCategoryForm = () => {
    setNewCategoryFormOpen(true);
  };

  const handleCloseNewCategoryForm = () => {
    setNewCategoryFormOpen(false);
  };

  const notFound = !dataFiltered.length && !loading;
  const totalPages = Math.ceil((dataFiltered.length || 0) / rowsPerPage);

  if (loading && !data) return <Loader />;

  if (error) {
    return (
      <div className="p-8 text-destructive font-bold text-center">
        {t("Error")}: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("categoryPage.title")}
        </h4>
        <Button
          onClick={handleOpenNewCategoryForm}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify
            icon="material-symbols-light:add"
            className="mr-2"
            width={24}
            height={24}
          />
          {t("categoryPage.addCategory")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CategoryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusFilter={statusFilter}
          onStatusFilter={handleFilterStatus}
        />

        <Scrollbar>
          <Table>
            <CategoryTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data ? data.length : 0}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                {
                  id: "category_name",
                  label: t("categoryPage.categoryName"),
                },
                { id: "status", label: t("Status") },
                { id: " " },
              ]}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24">
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
                    .map((row) => {
                      return (
                        <CategoryTableRow
                          key={row._id}
                          category_image={row.category_image}
                          category_name={row.category_name}
                          status={row.status}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={(event) => handleClick(event, row._id)}
                          onEdit={() => handleEditCategory(row)}
                          onDelete={(event) =>
                            openDeleteConfirmation(event, row._id)
                          }
                        />
                      );
                    })}

                  {!notFound && (
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        data ? data.length : 0,
                      )}
                    />
                  )}
                  {notFound && (
                    <TableNoDataFilter
                      query={filterName}
                      colSpan={4}
                      resourceName="Categories"
                    />
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        {/* Custom Pagination */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
          <div className="text-sm font-semibold text-gray-500">
            {t("Total")}:{" "}
            <span className="text-gray-900 font-bold">
              {dataFiltered.length}
            </span>{" "}
            {t("categories")}
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                {t("Rows per page")}:
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(v) => {
                  setPage(0);
                  handleRowsPerPageChange(parseInt(v));
                }}
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
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
                className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
              >
                <Iconify icon="material-symbols:chevron-right" width={20} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AddCategoryForm
        open={isNewCategoryFormOpen}
        onSave={handleSaveNewCategory}
        onCancel={handleCloseNewCategoryForm}
        onClose={handleCloseNewCategoryForm}
      />

      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onSave={handleSaveEditedCategory}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Delete Confirmation Popover */}
      <Popover
        open={isDeleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <PopoverTrigger />
        <PopoverContent className="w-64 p-4">
          <p className="text-sm font-medium mb-4">
            {t("Are you sure you want to delete this element ?")}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleDeleteCategory(selectedDeleteCategoryId);
              }}
              disabled={loadingDelete}
              className="flex-1"
            >
              {loadingDelete ? (
                <Iconify
                  icon="svg-spinners:180-ring-with-bg"
                  className="mr-2"
                  width={16}
                  height={16}
                />
              ) : null}
              {t("Confirm")}
            </Button>
            <Button
              variant="outline"
              onClick={closeDeleteConfirmation}
              className="flex-1"
            >
              {t("Cancel")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
