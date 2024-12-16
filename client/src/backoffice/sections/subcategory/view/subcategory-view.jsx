import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import TableContainer from "@mui/material/TableContainer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify/index.js";
import Scrollbar from "../../../components/scrollbar/index.js";

import TableNoDataFilter from "../table-no-data.jsx";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubCategoryTableRow from "../subcategory-table-row.jsx";
import SubCategoryTableHead from "../subcategory-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import SubCategoryTableToolbar from "../subcategory-table-toolbar.jsx";
import EditSubCategoryForm from "../subcategory-edit.jsx";
import NewSubCategoryForm from "../new-subcategory-form.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/subCategorySlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";

// ----------------------------------------------------------------------

export default function SubCategoryView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const data = useSelector((state) => state.adminSubcategory.data);
  const error = useSelector((state) => state.adminSubcategory.error);
  const loading = useSelector((state) => state.adminSubcategory.loading);
  const filterName = useSelector((state) => state.adminSubcategory.filterName);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewSubCategoryFormOpen, setNewSubCategoryFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteSubCategoryId, setSelectedDeleteSubCategoryId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance("admin")
  const currentLanguage = i18n.language;

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/subcategories");
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

  const openDeleteConfirmation = (event, subcategoryId) => {
    setSelectedDeleteSubCategoryId(subcategoryId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteSubCategoryId(null);
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

  const handleEditSubCategory = (subcategory) => {
    setEditingSubCategory(subcategory);
    setOpenModal(true);
  };

  const handleSaveEditedSubCategory = async (editedSubCategory) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/subcategories/${editedSubCategory._id}`,
        editedSubCategory
      );

      const index = data.findIndex(
        (subcategory) => subcategory._id === editedSubCategory._id
      );

      if (index !== -1) {
        const updatedSubCategories = [...data];
        updatedSubCategories[index] = {
          ...updatedSubCategories[index],
          subcategory_name: editedSubCategory.subcategory_name[currentLanguage],
          category_id: editedSubCategory.category_id,
          active: editedSubCategory.active,
        };
        dispatch(setData(updatedSubCategories));
        toast.success(response.data.message);
        setEditingSubCategory(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing subcategory:" + error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubCategory(null);
  };

  const handleDeleteSubCategory = async (subcategoryId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/subcategories/${subcategoryId}`);
      const updatedSubCategories = data.filter(
        (subcategory) => subcategory._id !== subcategoryId
      );
      dispatch(setData(updatedSubCategories));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenNewSubCategoryForm = () => {
    setNewSubCategoryFormOpen(true);
  };

  const handleCloseNewSubCategoryForm = () => {
    setNewSubCategoryFormOpen(false);
  };

  const handleSaveNewSubCategory = async (newSubCategory) => {
    setLoadingDelete(true);

    try {
      const response = await axiosInstance.post("/subcategories", newSubCategory);
      const subcategorydata = response.data.data;
      const AddedSubCategories = {
        key: subcategorydata._id,
        _id: subcategorydata._id,
        subcategory_name: newSubCategory.subcategory_name[currentLanguage],
        category_id: newSubCategory.category_id,
        active: newSubCategory.active,
      };

      dispatch(setData([...data, AddedSubCategories]));
      toast.success(response.data.message);

    } catch (error) {
      console.error("Error creating new subcategory:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      handleCloseNewSubCategoryForm();
      setLoadingDelete(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
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
        <Typography variant="h4">{t("Subcategories")}</Typography>
        <Fab
          variant="contained"
          onClick={handleOpenNewSubCategoryForm}
          color="primary"
          aria-label="add"
        >
          <Iconify icon="material-symbols-light:add" width={36} height={36} />
        </Fab>
      </Stack>

      <Card>
        <SubCategoryTableToolbar
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
                  { id: "active", label: t("Active") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <SubCategoryTableRow
                        key={row._id}
                        subcategory_name={row.subcategory_name}
                        category={row.category.category_name[currentLanguage]}
                        active={row.active}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditSubCategory(row)}
                        onDelete={(event) => openDeleteConfirmation(event, row._id)}
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

      <NewSubCategoryForm
        open={isNewSubCategoryFormOpen}
        onSave={handleSaveNewSubCategory}
        onCancel={handleCloseNewSubCategoryForm}
        onClose={handleCloseNewSubCategoryForm}
      />

      {editingSubCategory && (
        <EditSubCategoryForm
          subcategory={editingSubCategory}
          onSave={handleSaveEditedSubCategory}
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
            handleDeleteSubCategory(selectedDeleteSubCategoryId);
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
