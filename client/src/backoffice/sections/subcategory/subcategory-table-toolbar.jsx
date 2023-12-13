import React, { useState } from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubCategory } from "../../../redux/backoffice/subCategorySlice";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import axios from "axios";
import Iconify from "../../components/iconify";
import { useTranslation } from "react-i18next";

export default function SubCategoryTableToolbar({
  numSelected,
  selected,
  setSelected,
  filterName,
  onFilterName,
}) {
  const { t } = useTranslation();
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);

      let response; // Declare the response variable outside the loop
      const deletedSubCategoryIds = [];
      for (const subcategoryId of selected) {
        response = await axios.delete(`/v1/subcategories/${subcategoryId}`);
        deletedSubCategoryIds.push(subcategoryId);
      }

      // Dispatch the deleteSubCategory action to update the state
      dispatch(deleteSubCategory(deletedSubCategoryIds));

      setPopoverAnchor(null);
      setSelected([]);
      const snackbarMessage =
        selected.length === 1
          ? response.data.message
          : t(`Selected ${selected.length} subcategories are deleted`);

      openSnackbar(snackbarMessage);
    } catch (error) {
      setPopoverAnchor(null);
      openSnackbar(t("Error deleting subcategories:"), error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenPopover = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: "flex",
          justifyContent: "space-between",
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: "primary.main",
            bgcolor: "primary.lighter",
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1" color="secondary">
            {numSelected} {t("selected")}
          </Typography>
        ) : (
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder={t("Search for Subcategory...")}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="material-symbols-light:search-rounded"
                  width={30}
                  height={30}
                />
              </InputAdornment>
            }
          />
        )}

        {numSelected > 0 ? (
          <>
            <Tooltip title={t("Delete")}>
              <IconButton onClick={handleOpenPopover}>
                <Iconify
                  icon="material-symbols-light:delete-sweep-outline-rounded"
                  width={40}
                  height={40}
                />
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(popoverAnchor)}
              anchorEl={popoverAnchor}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  width: 250,
                  p: 2,
                  mt: 2,
                  mb: 2,
                  ml: 2,
                  mr: 2,
                },
              }}
            >
              <Typography sx={{ mb: 1 }} component="div" variant="subtitle1">
              {t("Are you sure you want to delete")} {numSelected} {t("selected elements ?")}
              </Typography>

              <LoadingButton
                color="primary"
                onClick={handleDelete}
                loading={loadingDelete}
              >
                {t("Yes")}
              </LoadingButton>
              <Button color="secondary" onClick={handleClosePopover}>
                {t("No")}
              </Button>
            </Popover>
          </>
        ) : (
          <></>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000} // Adjust as needed
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert onClose={closeSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Toolbar>
    </>
  );
}

SubCategoryTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
