import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from 'react-i18next';
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import { fDateTime } from "../../../utils/format-time";

import Label from "../../components/label";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function OrderTableRow({
  selected,
  customer,
  order_items,
  cart_total_price,
  order_date,
  status,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  // Toggle the selection
  const [open, setOpen] = useState(null);
  const { t } = useTranslation();
  const isActive = status;
  const color = isActive ? "primary" : "secondary";

  const customerFullName = `${customer.first_name} ${customer.last_name}`;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{customerFullName}</TableCell>
        <TableCell>
          {order_items.map((orderItem, index) => (
            <Stack key={index}>
              <Stack>
                <Typography sx={{ fontSize: "small" }}>
                  <strong>{t('Product N°')} {index + 1}</strong>
                </Typography>
                <Typography sx={{ fontSize: "small" }}>
                  <strong>{t('Name')}: </strong> {orderItem.product.product_name}
                </Typography>
              </Stack>
              {index < order_items.length - 1 && <div style={{ height: 8 }} />}
            </Stack>
          ))}
        </TableCell>
        <TableCell>{cart_total_price} DH</TableCell>
        <TableCell>{fDateTime(order_date)}</TableCell>
        <TableCell>
          <Badge
            sx={{
              minWidth: 24,
            }}
            badgeContent={isActive ? t('Active') : t('Inactive')}
            color={color}
          ></Badge>
        </TableCell>{" "}
        <TableCell align="center">
          <IconButton
            onClick={() =>
              onDetails({
                customer,
                order_items,
                cart_total_price,
                order_date,
                status,
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


OrderTableRow.propTypes = {
  handleClick: PropTypes.func,
  customer: PropTypes.object,
  order_items: PropTypes.array,
  cart_total_price: PropTypes.number,
  order_date: PropTypes.number,
  status: PropTypes.string,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
