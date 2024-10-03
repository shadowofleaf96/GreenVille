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

import { fDateTime } from "../../../utils/format-time";
import Label from "../../components/label";
import Iconify from "../../components/iconify";

// Function to convert payment methods to readable text
const getPaymentMethodLabel = (paymentMethod) => {
  switch (paymentMethod) {
    case 'credit_card':
      return 'Credit Card';
    case 'cod':
      return 'Cash on Delivery';
    case 'paypal':
      return 'Paypal';
    default:
      return paymentMethod;
  }
};

// ----------------------------------------------------------------------

export default function PaymentTableRow({
  selected,
  ordererName,
  amount,
  paymentMethod,
  paymentStatus,
  currency,
  createdAt,
  handleClick,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(null);
  const { t } = useTranslation();
  const isActive = paymentStatus;
  const color = isActive ? "primary" : "secondary";

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{ordererName}</TableCell>
        <TableCell>{amount} DH</TableCell>
        <TableCell>{getPaymentMethodLabel(paymentMethod)}</TableCell>
        <TableCell className="uppercase">{currency}</TableCell>
        <TableCell>{fDateTime(createdAt)}</TableCell>
        <TableCell>
          <Badge
            sx={{
              minWidth: 24,
            }}
            badgeContent={isActive ? t('Active') : t('Inactive')}
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

PaymentTableRow.propTypes = {
  handleClick: PropTypes.func,
  ordererName: PropTypes.string,
  amount: PropTypes.number,
  paymentMethod: PropTypes.string,
  currency: PropTypes.string,
  createdAt: PropTypes.string,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
