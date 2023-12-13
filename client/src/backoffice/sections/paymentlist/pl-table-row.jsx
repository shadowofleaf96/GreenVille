import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { fDateTime } from "../../../utils/format-time";


import Label from "../../components/label";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  product_image,
  sku,
  product_name,
  short_description,
  price,
  discount_price,
  option,
  creation_date,
  active,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  // Toggle the selection
  const [open, setOpen] = useState(null);
  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        // Handle row click for modal opening
      >
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={handleClick} // Handle checkbox click for selection
          />
        </TableCell>

        <TableCell>
          <Avatar align="center" alt={product_name} src={product_image} />
        </TableCell>

        <TableCell>{sku}</TableCell>

        <TableCell>{product_name}</TableCell>

        <TableCell>{price}</TableCell>

        <TableCell>{option}</TableCell>

        <TableCell>{fDateTime(creation_date)}</TableCell>

        <TableCell>
          <Label color={(active === true && "success") || "error"}>
            {active ? "active" : "inactive"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton
            onClick={() =>
              onDetails({
                product_image,
                sku,
                product_name,
                short_description,
                price,
                discount_price,
                option,
                creation_date,
                active,
              })
            }
          >
            <Iconify icon="material-symbols-light:visibility-outline-rounded" width={24} height={24} />
          </IconButton>

          <IconButton
            onClick={() => {
              onEdit && onEdit();
            }}
          >
            <Iconify
              icon="material-symbols-light:edit-outline-rounded"
              width={24}
              height={24}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              onDelete && onDelete();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="material-symbols-light:delete-outline-rounded" width={24} height={24} />
          </IconButton>
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
