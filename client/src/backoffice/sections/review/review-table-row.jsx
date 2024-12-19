import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Badge from "@mui/material/Badge";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function ReviewTableRow({
  selected,
  product,
  customer,
  rating,
  comment,
  review_date,
  status,
  handleClick,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  const isActive = status === "active";
  const color = isActive ? "primary" : "secondary";

  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      selected={selected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          disableRipple
          checked={selected}
          onChange={handleClick}
        />
      </TableCell>

      <TableCell>{product}</TableCell>
      <TableCell>{customer}</TableCell>
      <TableCell>{rating}</TableCell>
      <TableCell>{comment}</TableCell>
      <TableCell>{review_date}</TableCell>
      <TableCell>
        <Badge
          sx={{ minWidth: 24 }}
          badgeContent={isActive ? t("Active") : t("Inactive")}
          color={color}
        />
      </TableCell>

      <TableCell align="center">
        <IconButton
          onClick={onEdit}
        >
          <Iconify
            icon="material-symbols-light:edit-outline-rounded"
            width={28}
            height={28}
          />
        </IconButton>

        <IconButton
          onClick={onDelete}
          sx={{ color: "error.main" }}
        >
          <Iconify
            icon="material-symbols-light:delete-outline-rounded"
            width={28}
            height={28}
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

ReviewTableRow.propTypes = {
  handleClick: PropTypes.func,
  product: PropTypes.string,
  customer: PropTypes.string,
  rating: PropTypes.number,
  comment: PropTypes.string,
  review_date: PropTypes.string,
  active: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};