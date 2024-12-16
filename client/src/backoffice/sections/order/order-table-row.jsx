import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from 'react-i18next';
import Badge from "@mui/material/Badge";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { fDateTime } from "../../../utils/format-time";

import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function OrderTableRow({
  selected,
  customer,
  order_items,
  cart_total_price,
  order_date,
  shipping_method,
  shipping_status,
  status,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const [open, setOpen] = useState(null);
  const { t, i18n } = useTranslation();

  const customerFullName = `${customer?.first_name} ${customer?.last_name}`;
  const currentLanguage = i18n.language;
  const [shippingStatus, setShippingStatus] = useState("");

  useEffect(() => {
    if (shipping_status === "not_shipped") {
      setShippingStatus("Not Shipped")
    } else if (shipping_status === "shipped") {
      setShippingStatus("Shipped")
    } else if (shipping_status === "in_transit") {
      setShippingStatus("In Transit")
    } else if (shipping_status === "delivered") {
      setShippingStatus("Delivered")
    }
  }, [shipping_status])

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
                  <strong>{t('Name')}: </strong> {orderItem.product.product_name[currentLanguage]}
                </Typography>
              </Stack>
              {index < order_items.length - 1 && <div style={{ height: 8 }} />}
            </Stack>
          ))}
        </TableCell>
        <TableCell>{cart_total_price} DH</TableCell>
        <TableCell>{fDateTime(order_date)}</TableCell>
        <TableCell className="capitalize">{shipping_method}</TableCell>
        <TableCell>{shippingStatus}</TableCell>
        <TableCell className="capitalize">{status}</TableCell>
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
  order_date: PropTypes.string,
  shipping_method: PropTypes.string,
  shipping_status: PropTypes.string,
  status: PropTypes.string,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
