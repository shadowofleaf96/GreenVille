import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; // Importing translations

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { fDateTime } from "../../../utils/format-time";

import Label from "../../components/label";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  user_image,
  first_name,
  last_name,
  role,
  user_name,
  creation_date,
  active,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {

  const [open, setOpen] = useState(null);
  const { t } = useTranslation();
  const user = useSelector((state) => state.adminAuth.adminUser);
  const isActive = active;
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
            src={user_image}
          />
        </TableCell>

        <TableCell>{first_name}</TableCell>

        <TableCell>{last_name}</TableCell>

        <TableCell>{t(role)}</TableCell>

        <TableCell>{user_name}</TableCell>

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
                user_name,
                active,
                creation_date,
              })
            }
          >
            <Iconify
              icon="material-symbols-light:visibility-outline-rounded"
              width={26}
              height={26}
            />
          </IconButton>

          {user.role !== "manager" && (
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
          )}

          {user.role !== "manager" && (
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
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  user_image: PropTypes.string,
  handleClick: PropTypes.func,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  role: PropTypes.string,
  user_name: PropTypes.string,
  creation_date: PropTypes.number,
  active: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
