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
import { useTranslation } from "react-i18next";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "../../../components/iconify/index.js";
import Scrollbar from "../../../components/scrollbar/index.js";

import TableNoDataFilter from "../table-no-data.jsx";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewTableRow from "../review-table-row.jsx";
import ReviewTableHead from "../review-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import ReviewTableToolbar from "../review-table-toolbar.jsx";
import EditReviewForm from "../review-edit.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/reviewSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";

// ----------------------------------------------------------------------

export default function ReviewView() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language
  const data = useSelector((state) => state.adminReview.data);
  const error = useSelector((state) => state.adminReview.error);
  const loading = useSelector((state) => state.adminReview.loading);
  const filterName = useSelector((state) => state.adminReview.filterName);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteReviewId, setSelectedDeleteReviewId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance("admin")

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/reviews");
      const data = response?.data.data;
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

  const openDeleteConfirmation = (event, reviewId) => {
    setSelectedDeleteReviewId(reviewId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteReviewId(null);
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

  const handleEditReview = (review) => {
    setEditingReview(review);
    setOpenModal(true);
  };

  const handleSaveEditedReview = async (editedReview) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/reviews/${editedReview._id}`,
        editedReview
      );

      const index = data.findIndex((review) => review._id === editedReview._id);
      if (index !== -1) {
        const updatedReviews = response.data.data;
        dispatch(setData([updatedReviews]));
        toast.success(response.data.message);
        setEditingReview(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing review:", error);
      toast.error("Error: " + (error.response?.data?.message || "An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };


  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`);
      const updatedReviews = data.filter(
        (review) => review._id !== reviewId
      );
      dispatch(setData(updatedReviews));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
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
        <Typography variant="h4">{t("Reviews")}</Typography>
      </Stack>

      <Card>
        <ReviewTableToolbar
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
              <ReviewTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "product", label: t("Prdouct Name") },
                  { id: "customer", label: t("Customer Name") },
                  { id: "rating", label: t("Rating") },
                  { id: "comment", label: t("Comment") },
                  { id: "review_date", label: t("Review Date") },
                  { id: "status", label: t("Status") },
                  { id: " " },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { product_id, customer_id, rating, comment, review_date, status } = row;
                    const reviewDate = new Date(review_date).toLocaleDateString();

                    return (
                      <ReviewTableRow
                        key={row._id}
                        product={product_id.product_name[currentLanguage]}
                        customer={customer_id.first_name + " " + customer_id.last_name}
                        rating={rating}
                        comment={comment}
                        review_date={reviewDate}
                        status={status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditReview(row)}
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

      {editingReview && (
        <EditReviewForm
          review={editingReview}
          onSave={handleSaveEditedReview}
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
            handleDeleteReview(selectedDeleteReviewId);
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
