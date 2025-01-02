import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
  const [shippingMethod, setShippingMethod] = useState("");


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

  useEffect(() => {
    if (shipping_method === "standard") {
      setShippingMethod("Standard Shipping")
    } else if (shipping_status === "express") {
      setShippingStatus("Express Shipping")
    } else if (shipping_status === "overnight") {
      setShippingStatus("Overnight Shipping")
    }
  }, [shipping_method])

  const logoUrl =
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5";

  const formattedDate = new Date(order_date).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const leftMargin = 10;

    const imageWidth = 39;
    const imageHeight = 29.3;
    const x = (pageWidth - imageWidth) / 2;
    doc.addImage(logoUrl, "JPEG", x, 5, imageWidth, imageHeight);

    doc.setFontSize(32);
    doc.text(t('invoice_title'), 105, 50, { align: "center" });

    doc.setFontSize(12);
    doc.text(`${t('invoice_date')}: ${formattedDate}`, leftMargin, 80);

    doc.setFontSize(14);
    doc.text(t('customer_information'), leftMargin, 90);

    doc.setFontSize(12);
    doc.text(`${t('name')}: ${customerFullName}`, leftMargin, 100);
    doc.text(`${t('shipping_method')}: ${t(shippingMethod)}`, leftMargin, 110);
    doc.text(`${t('shipping_status')}: ${t(shippingStatus)}`, leftMargin, 120);

    doc.autoTable({
      startY: 130,
      head: [
        [
          t('table_item_number'),
          t('table_item_name'),
          t('table_quantity'),
          t('table_unit_price'),
          t('table_total'),
        ],
      ],
      body: order_items.map((item, index) => [
        index + 1,
        item.product?.product_name[currentLanguage],
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
      ]),
      theme: "grid",
      styles: {
        fontSize: 10,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(t('order_summary'), pageWidth - 10, finalY, { align: "right" });

    doc.setFontSize(12);
    doc.text(`${t('total_price')}: ${cart_total_price.toFixed(2)} DH`, pageWidth - 10, finalY + 10, { align: "right" });
    doc.text(`${t('order_status')}: ${t(status)}`, pageWidth - 10, finalY + 20, { align: "right" });

    const footerTextX = pageWidth / 2;
    doc.setFontSize(10);
    doc.text(t('thank_you_message'), footerTextX, pageHeight - 20, { align: "center" });
    doc.text(t('support_message'), footerTextX, pageHeight - 15, { align: "center" });

    doc.save(`invoice_${formattedDate}.pdf`);
  };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell className="!text-sm">{customerFullName}</TableCell>
        <TableCell className="!text-sm">
          {order_items.length + " Products"}
        </TableCell>
        <TableCell className="!text-sm">{cart_total_price} DH</TableCell>
        <TableCell className="!text-sm">{fDateTime(order_date)}</TableCell>
        <TableCell className="!text-sm !capitalize">{t(shipping_method)}</TableCell>
        <TableCell className="!text-sm">{t(shippingStatus)}</TableCell>
        <TableCell className="!text-sm !capitalize">{t(status)}</TableCell>
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
              width={22}
              height={22}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              onEdit && onEdit();
            }}
          >
            <Iconify
              icon="material-symbols-light:edit-outline-rounded"
              width={22}
              height={22}
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
              width={22}
              height={22}
            />
          </IconButton>
          <IconButton onClick={generatePDF}>
            <Iconify icon="material-symbols-light:download" width={22} height={22} />
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
