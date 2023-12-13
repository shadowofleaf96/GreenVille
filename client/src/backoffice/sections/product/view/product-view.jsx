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
import CircularProgress from "@mui/material/CircularProgress";
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

// ----------------------------------------------------------------------

export default function ProductPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const data = useSelector((state) => state.adminProduct.data);
  const error = useSelector((state) => state.adminProduct.error);
  const loading = useSelector((state) => state.adminProduct.loading);
  const filterName = useSelector((state) => state.adminProduct.filterName);
  const [skuFilter, setSkuFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      // Use axios to fetch data
      const response = await axios.get("/v1/products");
      const data = response.data.data;

      // Update the state with the fetched data
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

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Adjust this if needed
  };

  if (loading) {
    return (
      <Stack style={containerStyle}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Typography variant="body2">Error : {error.message} </Typography>;
  }

  // Render CircularProgress only when data is null
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

  const openDeleteConfirmation = (productId) => {
    setSelectedDeleteProductId(productId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteProductId(null);
    setDeleteConfirmationOpen(false);
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

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleSaveEditedProduct = async (editedProduct, selectedImage) => {
    setLoadingDelete(true);
    try {
      const formData = new FormData();
      formData.append("sku", editedProduct.sku);
      formData.append("product_name", editedProduct.product_name);
      formData.append("short_description", editedProduct.short_description);
      formData.append("subcategory_id", editedProduct.subcategory_id);
      formData.append("price", editedProduct.price);
      formData.append("discount_price", editedProduct.discount_price);
      formData.append("option", editedProduct.option);
      formData.append("quantity", editedProduct.quantity);
      formData.append("active", editedProduct.active);

      if (selectedImage) {
        formData.append("product_image", selectedImage);
      }

      const response = await axios.put(
        `/v1/products/${editedProduct._id}`,
        formData
      );

      const index = data.findIndex(
        (product) => product._id === editedProduct._id
      );

      if (index !== -1) {
        const updatedProducts = [...data];
        const productData = response.data.data;
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_image: selectedImage
            ? productData.product_image
            : updatedProducts[index].product_image,
          sku: editedProduct.sku,
          product_name: editedProduct.product_name,
          short_description: editedProduct.short_description,
          subcategory_id: editedProduct.subcategory_id,
          price: editedProduct.price,
          discount_price: editedProduct.discount_price,
          option: editedProduct.option,
          quantity: editedProduct.quantity,
          active: editedProduct.active,
          creation_date: editedProduct.creation_date,
          last_update: editedProduct.last_update,
        };
        dispatch(setData(updatedProducts));
        openSnackbar(response.data.message);
        setEditingProduct(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing product:" + error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null); // Close the edit form
  };

  const handleDeleteProduct = async (productId) => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(`/v1/products/${productId}`);
      const updatedProducts = data.filter(
        (product) => product._id !== productId
      );
      dispatch(setData(updatedProducts));
      openSnackbar(response.data.message);
    } catch (error) {
      console.error("Error deleting product:", error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
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

  const handleSaveNewProduct = async (newProduct, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("sku", newProduct.sku);
      formData.append("product_name", newProduct.product_name);
      formData.append("short_description", newProduct.short_description);
      formData.append("subcategory_id", newProduct.subcategory_id);
      formData.append("price", newProduct.price);
      formData.append("discount_price", newProduct.discount_price);
      formData.append("option", newProduct.option);
      formData.append("quantity", newProduct.quantity);
      formData.append("active", newProduct.active);

      if (selectedImage) {
        formData.append("product_image", selectedImage);
        newProduct.product_image = "images/" + selectedImage.name;
      } else {
        newProduct.product_image = "images/image_placeholder.png";
      }

      // Make API call to create a new product
      const response = await axios.post("/v1/products", formData);
      const productdata = response.data.data;
      const AddedProducts = {
        key: productdata._id,
        _id: productdata._id,
        product_image: productdata.product_image,
        sku: newProduct.sku,
        product_name: newProduct.product_name,
        short_description: newProduct.short_description,
        subcategory_id: newProduct.subcategory_id,
        price: newProduct.price,
        discount_price: newProduct.discount_price,
        quantity: newProduct.quantity,
        option: newProduct.option,
        active: newProduct.active,
        creation_date: productdata.creation_date,
        last_update: productdata.last_update,
      };

      dispatch(setData([...data, AddedProducts]));
      openSnackbar(response.data.message);

      // Optionally, update the products state or perform any other necessary actions
    } catch (error) {
      console.error("Error creating new product:", error);
      openSnackbar("Error: " + error.response.data.message);
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
                  { id: "product_image", label: t("Image") },
                  { id: "sku", label: t("SKU") },
                  { id: "product_name", label: t("Product Name") },
                  { id: "price", label: t("Price") },
                  { id: "quantity", label: t("Quantity") },
                  { id: "creation_date", label: t("Creation Date") },
                  { id: "active", label: t("Active") },
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
                        product_image={`http://localhost:3000/${row.product_image}`}
                        sku={row.sku}
                        product_name={row.product_name}
                        price={row.price}
                        quantity={row.quantity}
                        creation_date={row.creation_date}
                        active={row.active}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditProduct(row)}
                        onDelete={() => openDeleteConfirmation(row._id)}
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
      <Popover
        anchorEl={isDeleteConfirmationOpen}
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={
            typeof snackbarMessage === "string" &&
            snackbarMessage.includes("Error")
              ? "error"
              : "success"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
