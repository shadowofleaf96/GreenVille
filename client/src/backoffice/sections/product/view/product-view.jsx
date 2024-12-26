import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import TableContainer from "@mui/material/TableContainer";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import TableNoDataFilter from "../table-no-data";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductTableRow from "../product-table-row";
import { useTranslation } from "react-i18next";
import ProductTableHead from "../product-table-head";
import TableEmptyRows from "../table-empty-rows";
import ProductTableToolbar from "../product-table-toolbar";
import EditProductForm from "../product-edit";
import NewProductForm from "../new-product-form.jsx";
import ProductDetailsPopup from "../product-details";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/productSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
const backend = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------------------------------

export default function ProductPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language

  const data = useSelector((state) => state.adminProduct.data);
  const error = useSelector((state) => state.adminProduct.error);
  const loading = useSelector((state) => state.adminProduct.loading);
  const filterName = useSelector((state) => state.adminProduct.filterName);
  const [skuFilter, setSkuFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
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
      const response = await axiosInstance.get(`/products`);
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

  const openDeleteConfirmation = (event, productId) => {
    setSelectedDeleteProductId(productId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteProductId(null);
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

  const handleFilterBySku = (event) => {
    const value = event.target.value;
    setSkuFilter(value);
    setPage(0);
  };

  const handleFilterByPrice = (event) => {
    const value = event.target.value;
    setPriceFilter(value);
    setPage(0);
  };

  const handleFilterByQuantity = (event) => {
    const value = event.target.value;
    setQuantityFilter(value);
    setPage(0);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleSaveEditedProduct = async (editedProduct, selectedImages) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("sku", editedProduct.sku);
      formData.append("product_name[en]", editedProduct.product_name.en);
      formData.append("product_name[fr]", editedProduct.product_name.fr);
      formData.append("product_name[ar]", editedProduct.product_name.ar);
      formData.append("short_description[en]", editedProduct.short_description.en);
      formData.append("short_description[fr]", editedProduct.short_description.fr);
      formData.append("short_description[ar]", editedProduct.short_description.ar);
      formData.append("long_description[en]", editedProduct.long_description.en);
      formData.append("long_description[fr]", editedProduct.long_description.fr);
      formData.append("long_description[ar]", editedProduct.long_description.ar);
      formData.append("subcategory_id", editedProduct.subcategory_id);
      formData.append("price", editedProduct.price);
      formData.append("discount_price", editedProduct.discount_price);
      formData.append("option", editedProduct.option);
      formData.append("quantity", editedProduct.quantity);
      formData.append("status", editedProduct.status);

      if (selectedImages) {
        Array.from(selectedImages).forEach((image) => {
          formData.append("product_images", image);
        });
      }

      const response = await axiosInstance.put(`/products/${editedProduct._id}`, formData);
      const productData = response.data.data;

      const index = data.findIndex((product) => product._id === editedProduct._id);

      if (index !== -1) {
        const updatedProducts = [...data];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_images: selectedImages ? productData.product_images : updatedProducts[index].product_images,
          sku: editedProduct.sku,
          product_name: editedProduct.product_name,
          short_description: editedProduct.short_description,
          long_description: editedProduct.long_description,
          subcategory_id: editedProduct.subcategory_id,
          subcategory: productData.subcategory,
          price: editedProduct.price,
          discount_price: editedProduct.discount_price,
          option: editedProduct.option,
          quantity: editedProduct.quantity,
          status: editedProduct.status,
          creation_date: productData.creation_date,
          last_update: productData.last_update,
        };

        dispatch(setData(updatedProducts));
        toast.success(response.data.message);
        setEditingProduct(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing product:" + error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };


  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      const updatedProducts = data.filter(
        (product) => product._id !== productId
      );
      dispatch(setData(updatedProducts));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenDetailsPopup = (product) => {
    setSelectedProduct(product);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewProductForm = () => {
    setNewProductFormOpen(true);
  };

  const handleCloseNewProductForm = () => {
    setNewProductFormOpen(false);
  };

  const handleSaveNewProduct = async (newProduct, selectedImages) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();

      formData.append("sku", newProduct.sku);

      formData.append("product_name[en]", newProduct.product_name.en);
      formData.append("product_name[fr]", newProduct.product_name.fr);
      formData.append("product_name[ar]", newProduct.product_name.ar);

      formData.append("short_description[en]", newProduct.short_description.en);
      formData.append("short_description[fr]", newProduct.short_description.fr);
      formData.append("short_description[ar]", newProduct.short_description.ar);

      formData.append("long_description[en]", newProduct.long_description.en);
      formData.append("long_description[fr]", newProduct.long_description.fr);
      formData.append("long_description[ar]", newProduct.long_description.ar);

      formData.append("subcategory_id", newProduct.subcategory_id);
      formData.append("price", newProduct.price);
      formData.append("discount_price", newProduct.discount_price);
      formData.append("option", String(newProduct.option));
      formData.append("quantity", newProduct.quantity);
      formData.append("status", newProduct.status);

      if (selectedImages) {
        Array.from(selectedImages).forEach((image) => {
          formData.append("product_images", image);
        });
      }

      const response = await axiosInstance.post("/products", formData);
      const productdata = response.data.data;

      const AddedProducts = {
        key: productdata._id,
        _id: productdata._id,
        product_images: productdata.product_images,
        sku: newProduct.sku,
        product_name: newProduct.product_name,
        short_description: newProduct.short_description,
        long_description: newProduct.long_description,
        subcategory_id: newProduct.subcategory_id,
        subcategory: newProduct.subcategory,
        price: newProduct.price,
        discount_price: newProduct.discount_price,
        quantity: newProduct.quantity,
        option: newProduct.option,
        status: newProduct.status,
        creation_date: productdata.creation_date,
        last_update: productdata.last_update,
      };

      dispatch(setData([...data, AddedProducts]));
      toast.success(t(response.data.message));

    } catch (error) {
      console.error("Error creating new product:", error);
      toast.error(t("Error: ") + error.response.data.message);
    } finally {
      handleCloseNewProductForm();
      setLoadingDelete(false);
    }
  };


  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
    skuFilter,
    priceFilter,
    quantityFilter,
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
        <Typography variant="h4">{t("Products")}</Typography>
        <Fab
          variant="contained"
          onClick={handleOpenNewProductForm}
          color="primary"
          aria-label="add"
        >
          <Iconify icon="material-symbols-light:add" width={36} height={36} />
        </Fab>
      </Stack>

      <Card>
        <ProductTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          skuFilter={skuFilter}
          onSkuFilter={handleFilterBySku}
          priceFilter={priceFilter}
          onPriceFilter={handleFilterByPrice}
          quantityFilter={quantityFilter}
          onQuantityFilter={handleFilterByQuantity}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
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
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <ProductTableRow
                        key={row._id}
                        product_images={`${row.product_images[0]}`}
                        sku={row.sku}
                        product_name={row.product_name}
                        price={row.price}
                        quantity={row.quantity}
                        creation_date={row.creation_date}
                        status={row.status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditProduct(row)}
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

      <NewProductForm
        open={isNewProductFormOpen}
        onSave={handleSaveNewProduct}
        onCancel={handleCloseNewProductForm}
        onClose={handleCloseNewProductForm}
      />

      <ProductDetailsPopup
        product={selectedProduct}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />
      {editingProduct && (
        <EditProductForm
          Product={editingProduct}
          onSave={handleSaveEditedProduct}
          onCancel={handleCancelEdit}
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
            handleDeleteProduct(selectedDeleteProductId);
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
