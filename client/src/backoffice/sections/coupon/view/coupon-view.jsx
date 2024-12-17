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
import axios from "axios";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CouponTableRow from "../coupon-table-row.jsx";
import CouponTableHead from "../coupon-table-head.jsx";
import TableEmptyRows from "../table-empty-rows.jsx";
import CouponTableToolbar from "../coupon-table-toolbar.jsx";
import EditCouponForm from "../coupon-edit.jsx";
import NewCouponForm from "../new-coupon-form.jsx";

import { emptyRows, applyFilter, getComparator } from "../utils.js";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "../../../../redux/backoffice/couponSlice.js";
import Loader from "../../../../frontoffice/components/loader/Loader.jsx";
import createAxiosInstance from "../../../../utils/axiosConfig.jsx";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";

// ----------------------------------------------------------------------

export default function CouponView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const data = useSelector((state) => state.adminCoupon.data);
  const error = useSelector((state) => state.adminCoupon.error);
  const loading = useSelector((state) => state.adminCoupon.loading);
  const filterName = useSelector((state) => state.adminCoupon.filterName);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isNewCouponFormOpen, setNewCouponFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteCouponId, setSelectedDeleteCouponId] =
    useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const axiosInstance = createAxiosInstance("admin")

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/coupons");
      const data = response?.data?.data;
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

  const openDeleteConfirmation = (event, couponId) => {
    setSelectedDeleteCouponId(couponId);
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteCouponId(null);
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

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setOpenModal(true);
  };

  const handleSaveEditedCoupon = async (editedCoupon) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/coupons/${editedCoupon._id}`,
        editedCoupon
      );

      const index = data.findIndex((coupon) => coupon._id === editedCoupon._id);

      if (index !== -1) {
        const updatedCoupons = [...data];
        updatedCoupons[index] = {
          ...updatedCoupons[index],
          code: editedCoupon.code,
          discount: editedCoupon.discount,
          expiresAt: editedCoupon.expiresAt,
          usageLimit: editedCoupon.usageLimit,
          active: editedCoupon.active,
        };

        dispatch(setData(updatedCoupons));
        toast.success(response.data.message);
        setEditingCoupon(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing coupon:", error);
      toast.error("Error: " + (error.response?.data?.message || "An error occurred"));
    } finally {
      setLoadingDelete(false);
    }
  };


  const handleCancelEdit = () => {
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = async (couponId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/coupons/${couponId}`);
      const updatedCoupons = data.filter(
        (coupon) => coupon._id !== couponId
      );
      dispatch(setData(updatedCoupons));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenNewCouponForm = () => {
    setNewCouponFormOpen(true);
  };

  const handleCloseNewCouponForm = () => {
    setNewCouponFormOpen(false);
  };

  const handleSaveNewCoupon = async (newCoupon) => {
    setLoadingDelete(true);

    try {
      const response = await axiosInstance.post("/coupons/create", newCoupon);
      const coupondata = response.data.data;
      const AddedCoupons = {
        key: coupondata._id,
        _id: coupondata._id,
        code: newCoupon.code,
        discount: newCoupon.discount,
        expiresAt: newCoupon.expiresAt,
        usageLimit: newCoupon.usageLimit,
        status: newCoupon.status,
      };

      dispatch(setData([...data, AddedCoupons]));
      toast.success(response.data.message);

    } catch (error) {
      console.error("Error creating new coupon:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      handleCloseNewCouponForm();
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
        <Typography variant="h4">{t("Coupons")}</Typography>
        <Fab
          variant="contained"
          onClick={handleOpenNewCouponForm}
          color="primary"
          aria-label="add"
        >
          <Iconify icon="material-symbols-light:add" width={36} height={36} />
        </Fab>
      </Stack>

      <Card>
        <CouponTableToolbar
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
              <CouponTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
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
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { code, discount, usageLimit, expiresAt, status } = row;
                    const expirationDate = new Date(expiresAt).toLocaleDateString();

                    return (
                      <CouponTableRow
                        key={row._id}
                        code={code}
                        discount={discount}
                        expiresAt={expirationDate}
                        usageLimit={usageLimit}
                        status={status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditCoupon(row)}
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

      <NewCouponForm
        open={isNewCouponFormOpen}
        onSave={handleSaveNewCoupon}
        onCancel={handleCloseNewCouponForm}
        onClose={handleCloseNewCouponForm}
      />

      {editingCoupon && (
        <EditCouponForm
          coupon={editingCoupon}
          onSave={handleSaveEditedCoupon}
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
            handleDeleteCoupon(selectedDeleteCouponId);
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
