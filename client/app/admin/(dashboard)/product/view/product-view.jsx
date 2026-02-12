"use client";

import { useState, useCallback, useEffect } from "react";
import Iconify from "@/components/shared/iconify";
import Scrollbar from "@/admin/_components/scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ProductTableRow from "../product-table-row";
import ProductTableHead from "../product-table-head";

import TableNoDataFilter from "@/admin/_components/table/TableNoData";
import ProductTableToolbar from "../product-table-toolbar";
import EditProductForm from "../product-edit";
import NewProductForm from "../new-product-form.jsx";
import ProductDetailsPopup from "../product-details";
import { debounce } from "lodash";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
  setTotal,
} from "@/store/slices/admin/productSlice.js";
import Loader from "@/frontoffice/_components/loader/Loader.jsx";
import createAxiosInstance from "@/utils/axiosConfig.jsx";
import { toast } from "react-toastify";

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

export default function ProductPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const data = useSelector((state) => state.adminProduct.data);
  const total = useSelector((state) => state.adminProduct.total);
  const error = useSelector((state) => state.adminProduct.error);
  const loading = useSelector((state) => state.adminProduct.loading);
  const filterName = useSelector((state) => state.adminProduct.filterName);
  const { admin } = useSelector((state) => state.adminAuth);

  const [skuFilter, setSkuFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderBy, setOrderBy] = useState("product_name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isNewProductFormOpen, setNewProductFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteProductId, setSelectedDeleteProductId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortOrder: order,
        sortBy: orderBy,
      };

      if (filterName) params.search = filterName;
      if (skuFilter) params.sku = skuFilter;
      if (priceFilter) params.price = priceFilter;
      if (quantityFilter) params.quantity = quantityFilter;

      const endpoint =
        admin?.role === "vendor" ? "/products/vendor" : "/products";

      const response = await axiosInstance.get(endpoint, { params });
      const { data: products, total: totalCount } = response.data;
      dispatch(setData(products));
      dispatch(setTotal(totalCount));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData();
    }, 500),
    [
      page,
      rowsPerPage,
      order,
      orderBy,
      filterName,
      skuFilter,
      priceFilter,
      quantityFilter,
    ],
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    rowsPerPage,
    order,
    orderBy,
    filterName,
    skuFilter,
    priceFilter,
    quantityFilter,
  ]);

  if (loading && !data) return <Loader />;

  if (error) {
    return (
      <div className="p-8 text-destructive font-bold">
        Error: {error.message}
      </div>
    );
  }

  const dataFiltered = data || [];
  const notFound = !dataFiltered.length && !loading;

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

  const openDeleteConfirmation = (event, productId) => {
    setSelectedDeleteProductId(productId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };

  const handlePageChange = (newPage) => {
    dispatch(setLoading(true));
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    dispatch(setLoading(true));
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    dispatch(setFilterName(event.target.value));
    setPage(0);
  };

  const handleSaveEditedProduct = async (editedProduct, selectedImages) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("sku", editedProduct.sku);
      formData.append("product_name[en]", editedProduct.product_name.en);
      formData.append("product_name[fr]", editedProduct.product_name.fr);
      formData.append("product_name[ar]", editedProduct.product_name.ar);
      formData.append("subcategory_id", editedProduct.subcategory_id);
      formData.append("price", editedProduct.price);
      formData.append("discount_price", editedProduct.discount_price);
      formData.append("option", editedProduct.option);
      console.log(
        "DEBUG: Updating quantity:",
        editedProduct.quantity,
        "Type:",
        typeof editedProduct.quantity,
      );
      formData.append("quantity", editedProduct.quantity);
      formData.append("status", editedProduct.status);
      formData.append("on_sale", editedProduct.on_sale);

      // Add missing description fields
      if (editedProduct.short_description) {
        formData.append(
          "short_description[en]",
          editedProduct.short_description.en || "",
        );
        formData.append(
          "short_description[fr]",
          editedProduct.short_description.fr || "",
        );
        formData.append(
          "short_description[ar]",
          editedProduct.short_description.ar || "",
        );
      }
      if (editedProduct.long_description) {
        formData.append(
          "long_description[en]",
          editedProduct.long_description.en || "",
        );
        formData.append(
          "long_description[fr]",
          editedProduct.long_description.fr || "",
        );
        formData.append(
          "long_description[ar]",
          editedProduct.long_description.ar || "",
        );
      }
      if (editedProduct.variants)
        formData.append("variants", JSON.stringify(editedProduct.variants));
      if (selectedImages)
        Array.from(selectedImages).forEach((image) =>
          formData.append("product_images", image),
        );

      const response = await axiosInstance.put(
        `/products/${editedProduct._id}`,
        formData,
      );
      toast.success(response.data.message);
      setEditingProduct(null);
      setOpenModal(false);
      fetchData();
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(`/products/${productId}`);
      toast.success(t("Product deleted successfully"));
      fetchData();
      setSelected([]);
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingDelete(false);
      closeDeleteConfirmation();
    }
  };

  const handleSaveNewProduct = async (newProduct, selectedImages) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("sku", newProduct.sku);
      formData.append("product_name[en]", newProduct.product_name.en);
      formData.append("product_name[fr]", newProduct.product_name.fr);
      formData.append("product_name[ar]", newProduct.product_name.ar);
      formData.append("subcategory_id", newProduct.subcategory_id);
      formData.append("price", newProduct.price);
      formData.append("discount_price", newProduct.discount_price);
      formData.append("option", String(newProduct.option));
      formData.append("quantity", newProduct.quantity);
      formData.append("status", newProduct.status);
      formData.append("on_sale", newProduct.on_sale);
      if (newProduct.variants)
        formData.append("variants", JSON.stringify(newProduct.variants));
      if (selectedImages)
        Array.from(selectedImages).forEach((image) =>
          formData.append("product_images", image),
        );

      await axiosInstance.post("/products", formData);
      toast.success(t("Product created successfully"));
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(t("Error creating product"));
    } finally {
      setNewProductFormOpen(false);
      setLoadingDelete(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Products")}
        </h4>
        <Button
          onClick={() => setNewProductFormOpen(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify
            icon="material-symbols-light:add"
            className="mr-2"
            width={24}
            height={24}
          />
          {t("Add Product")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <ProductTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            skuFilter={skuFilter}
            onSkuFilter={(e) => {
              setSkuFilter(e.target.value);
              setPage(0);
            }}
            priceFilter={priceFilter}
            onPriceFilter={(e) => {
              setPriceFilter(e.target.value);
              setPage(0);
            }}
            quantityFilter={quantityFilter}
            onQuantityFilter={(e) => {
              setQuantityFilter(e.target.value);
              setPage(0);
            }}
            selected={selected}
            setSelected={setSelected}
            fetchData={fetchData}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          <Scrollbar>
            <Table>
              <ProductTableHead
                order={order}
                orderBy={orderBy}
                rowCount={total}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "product_images", label: t("Image") },
                  { id: "sku", label: t("SKU") },
                  { id: "product_name", label: t("Product Name") },
                  { id: "price", label: t("Price") },
                  { id: "quantity", label: t("Quantity") },
                  { id: "creation_date", label: t("Creation Date") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24">
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
                    {dataFiltered.map((row) => (
                      <ProductTableRow
                        key={row._id}
                        product_images={row.product_images?.[0]}
                        sku={row.sku}
                        product_name={row.product_name}
                        price={row.price}
                        quantity={row.quantity}
                        creation_date={row.creation_date}
                        status={row.status}
                        on_sale={row.on_sale}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={() => handleClick(row._id)}
                        onEdit={() => {
                          setEditingProduct(row);
                          setOpenModal(true);
                        }}
                        onDelete={(event) =>
                          openDeleteConfirmation(event, row._id)
                        }
                        onDetails={() => {
                          setSelectedProduct(row);
                          setDetailsPopupOpen(true);
                        }}
                      />
                    ))}

                    {notFound && (
                      <TableNoDataFilter query={filterName} colSpan={9} />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>

          <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-500">
              {t("Total")}:{" "}
              <span className="text-gray-900 font-bold">{total}</span>{" "}
              {t("products")}
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
                  <SelectTrigger className="w-17.5 bg-transparent border-none text-sm font-bold shadow-none focus:ring-0">
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
                  <Iconify
                    icon="material-symbols:chevron-left"
                    width={20}
                    height={20}
                  />
                </Button>
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-primary min-w-9 text-center">
                  {page + 1}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={(page + 1) * rowsPerPage >= total}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
                >
                  <Iconify
                    icon="material-symbols:chevron-right"
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewProductForm
        open={isNewProductFormOpen}
        onSave={handleSaveNewProduct}
        onCancel={() => setNewProductFormOpen(false)}
        onClose={() => setNewProductFormOpen(false)}
      />

      <ProductDetailsPopup
        product={selectedProduct}
        open={isDetailsPopupOpen}
        onClose={() => setDetailsPopupOpen(false)}
      />

      {editingProduct && (
        <EditProductForm
          Product={editingProduct}
          onSave={handleSaveEditedProduct}
          onCancel={() => {
            setEditingProduct(null);
            setOpenModal(false);
          }}
          open={openModal}
          onClose={() => {
            setEditingProduct(null);
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
              onClick={() => handleDeleteProduct(selectedDeleteProductId)}
              className="w-full h-12 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingDelete ? (
                <>
                  <Iconify
                    icon="svg-spinners:180-ring-with-bg"
                    className="mr-2"
                    width={20}
                    height={20}
                  />
                  {t("Deleting...")}
                </>
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
