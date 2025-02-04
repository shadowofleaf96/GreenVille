// Importing necessary dependencies
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; // Using translation hook

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function SubCategoryTableRow({
  selected,
  subcategory_name,
  category_id,
  category,
  status,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language

  const [open, setOpen] = useState(null);
  const isActive = status;
  const color = isActive ? "primary" : "secondary";

  return (
    <>
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

        <TableCell>{t(subcategory_name[currentLanguage])}</TableCell>

        {/* <TableCell>{category_id}</TableCell> */}

        <TableCell>{t(category)}</TableCell>

        <TableCell>
          <Badge
            sx={{
              minWidth: 24,
            }}
            badgeContent={isActive ? t("Active") : t("Inactive")}
            color={color}
          ></Badge>
        </TableCell>

        <TableCell align="center">
          <IconButton
            onClick={() => {
              onEdit && onEdit();
            }}
          >
            <Iconify
              icon="material-symbols-light:edit-outline-rounded"
              width={28}
              height={28}
            />
          </IconButton>

          <IconButton
            onClick={(event) => {
              onDelete && onDelete(event);
            }}
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
    </>
  );
}

SubCategoryTableRow.propTypes = {
  handleClick: PropTypes.func,
  subcategory_name: PropTypes.string,
  category_id: PropTypes.string,
  category: PropTypes.string,
  status: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
