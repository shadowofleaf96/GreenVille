import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import Label from "../../components/label";
import Iconify from "../../components/iconify";
import { fDateTime } from "../../../utils/format-time";

// ----------------------------------------------------------------------

export default function CustomerTableRow({
  selected,
  customer_image,
  first_name,
  last_name,
  email,
  creation_date,
  active,
  last_login,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  // Toggle the selection
  const [open, setOpen] = useState(null);
  const isActive = active;
  const { t } = useTranslation();
  const color = isActive ? "primary" : "secondary";
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>
          <Avatar
            align="center"
            alt={`${first_name} ${last_name}`}
            src={customer_image}
          />
        </TableCell>

        <TableCell>{first_name}</TableCell>

        <TableCell>{last_name}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{fDateTime(creation_date)}</TableCell>

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
            onClick={() =>
              onDetails({
                first_name,
                last_name,
                email,
                active,
                creation_date,
                last_login,
              })
            }
          >
            <Iconify
              icon="material-symbols-light:visibility-outline-rounded"
              width={26}
              height={26}
            />
          </IconButton>

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

CustomerTableRow.propTypes = {
  customer_image: PropTypes.string,
  handleClick: PropTypes.func,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  email: PropTypes.string,
  creation_date: PropTypes.number,
  active: PropTypes.bool,
  last_login: PropTypes.number,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
