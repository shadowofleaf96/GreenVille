import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { fDateTime } from "../../../utils/format-time";

import Label from "../../components/label";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function CategoryTableRow({
  selected,
  category_name,
  handleClick,
  active,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t } = useTranslation();
  // Toggle the selection
  const [open, setOpen] = useState(null);
  const isActive = active;
  const color = isActive ? "primary" : "secondary";

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{t(category_name)}</TableCell>

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
          {/* Not needed here */}
          {/* <IconButton
            onClick={() =>
              onDetails({
                category_name,
                active,
              })
            }
          >
               <Iconify icon="material-symbols-light:visibility-outline-rounded" width={26} height={26} />
          </IconButton> */}

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

CategoryTableRow.propTypes = {
  category_name: PropTypes.string,
  active: PropTypes.bool,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
