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
import { useTranslation } from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import Snackbar from "@mui/material/Snackbar";
import Fab from "@mui/material/Fab";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import TableNoDataFilter from "../table-no-data";
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryTableRow from "../category-table-row";
import CategoryTableHead from "../category-table-head";
import TableEmptyRows from "../table-empty-rows";
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

// ----------------------------------------------------------------------

export default function CategoryPage() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminCategory.data);
  const error = useSelector((state) => state.adminCategory.error);
  const loading = useSelector((state) => state.adminCategory.loading);
  const filterName = useSelector((state) => state.adminCategory.filterName);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isNewCategoryFormOpen, setNewCategoryFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteCategoryId, setSelectedDeleteCategoryId] =
    useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      // Use axios to fetch data
      const response = await axios.get("/v1/categories");
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

  const openDeleteConfirmation = (categoryId) => {
    setSelectedDeleteCategoryId(categoryId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteCategoryId(null);
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

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleSaveEditedCategory = async (editedCategory) => {
    setLoadingDelete(true);
    try {
      const response = await axios.put(
        `/v1/categories/${editedCategory._id}`,
        editedCategory
      );

      const index = data.findIndex(
        (category) => category._id === editedCategory._id
      );

      if (index !== -1) {
        const updatedCategory = [...data];
        updatedCategory[index] = {
          ...updatedCategory[index],
          category_name: editedCategory.category_name,
          active: editedCategory.active,
        };
        dispatch(setData(updatedCategory));
        openSnackbar(response.data.message);
        setEditingCategory(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing category:" + error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null); // Close the edit form
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(`/v1/categories/${categoryId}`);
      const updatedCategories = data.filter(
        (category) => category._id !== categoryId
      );
      dispatch(setData(updatedCategories));
      openSnackbar(response.data.message);
    } catch (error) {
      console.error("Error deleting category:", error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  //-------
  const handleOpenDetailsPopup = (category) => {
    setSelectedCategory(category);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewCategoryForm = () => {
    setNewCategoryFormOpen(true);
  };

  const handleCloseNewCategoryForm = () => {
    setNewCategoryFormOpen(false);
  };

  const handleSaveNewCategory = async (newCategory) => {
    setLoadingDelete(true);

    try {
      const response = await axios.post("/v1/categories", newCategory);
      const categorydata = response.data.data;
      const AddedCategory = {
        key: categorydata._id,
        _id: categorydata._id,
        category_name: newCategory.category_name,
        active: newCategory.active,
      };

      dispatch(setData([...data, AddedCategory]));
      openSnackbar(response.data.message);
    } catch (error) {
      console.error("Error creating new category:", error);
      openSnackbar("Error: " + error.response.data.message);
    } finally {
      handleCloseNewCategoryForm();
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
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
        <Typography variant="h4">{t("categoryPage.title")}</Typography>
        <Fab
          variant="contained"
          onClick={handleOpenNewCategoryForm}
          color="primary"
          aria-label="add"
        >
          <Iconify icon="material-symbols-light:add" width={36} height={36} />
        </Fab>
      </Stack>

      <Card>
        <CategoryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <CategoryTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  {
                    id: "category_name",
                    label: t("categoryPage.categoryName"),
                  },
                  { id: "active", label: t("categoryPage.active") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <CategoryTableRow
                        key={row._id}
                        category_name={row.category_name}
                        active={row.active}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditCategory(row)}
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
            handleDeleteCategory(selectedDeleteCategoryId);
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
        autoHideDuration={5000} // Adjust as needed
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
