import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { fDateTime } from "../../../utils/format-time";
import Iconify from "../../../components/iconify";

import { useSelector } from "react-redux";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function OrderTableRow({
  id,
  selected,
  customer,
  order_items,
  cart_total_price,
  order_date,
  shipping_method,
  shipping_status,
  status,
  delivery_boy,
  shipping_price,
  tax,
  coupon_discount,
  shipping_address,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);

  const customerFullName =
    customer?.first_name || customer?.last_name
      ? `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim()
      : customer?.email || t("Unknown Customer");
  const currentLanguage = i18n.language;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [shippingStatusLabel, setShippingStatusLabel] = useState("");
  const [shippingMethodLabel, setShippingMethodLabel] = useState(""); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const statusMap = {
      not_shipped: "Not Shipped",
      shipped: "Shipped",
      in_transit: "In Transit",
      delivered: "Delivered",
    };
    setShippingStatusLabel(statusMap[shipping_status] || shipping_status);
  }, [shipping_status]);

  useEffect(() => {
    const methodMap = {
      standard: "Standard Shipping",
      express: "Express Shipping",
      overnight: "Overnight Shipping",
    };
    setShippingMethodLabel(methodMap[shipping_method] || shipping_method);
  }, [shipping_method]);

  const siteLogo = settings?.logo_url;
  const siteTitle =
    settings?.website_title?.[currentLanguage] || settings?.website_title?.en;
  const sitePrimaryColor = settings?.theme?.primary_color;

  const companyAddress =
    settings?.contact_page?.address?.[currentLanguage] ||
    settings?.contact_page?.address?.en;
  const companyCity =
    settings?.contact_page?.address_city?.[currentLanguage] ||
    settings?.contact_page?.address_city?.en;
  const companyPhone = settings?.contact_page?.phone;
  const companyEmail = settings?.contact_page?.email;

  const formattedDate = new Date(order_date).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generatePDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Convert HEX to RGB for jspdf
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
            ]
          : [141, 198, 63];
      };

      const brandColor = hexToRgb(sitePrimaryColor);

      const loadImage = (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/png"));
            } catch (e) {
              reject(new Error("Canvas conversion failed: " + e.message));
            }
          };
          img.onerror = () =>
            reject(new Error("Failed to load image from URL"));
          img.src = url;
          setTimeout(() => reject(new Error("Image load timeout")), 10000);
        });

      // 1. Header & Logo
      try {
        const base64Logo = await loadImage(siteLogo);
        doc.addImage(base64Logo, "PNG", margin, 15, 30, 22);
      } catch (error) {
        console.error("Error loading logo:", error);
      }

      // Company Info (Right side)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.text(siteTitle.toUpperCase(), pageWidth - margin, 25, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${companyAddress}, ${companyCity}`, pageWidth - margin, 32, {
        align: "right",
      });
      doc.text(`${companyEmail} | ${companyPhone}`, pageWidth - margin, 37, {
        align: "right",
      });

      // Separator Line
      doc.setDrawColor(240);
      doc.line(margin, 45, pageWidth - margin, 45);

      // 2. Invoice Meta Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(t("INVOICE"), margin, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`${t("Date")}: ${formattedDate}`, margin, 62);
      doc.text(
        `${t("Order ID")}: #${id.toString().slice(-5).toUpperCase()}`,
        margin,
        67,
      );

      // 3. Customer & Shipping Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(t("Bill To"), margin, 80);
      doc.text(t("Ship To"), pageWidth / 2, 80);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      // Billing info
      doc.text(customerFullName, margin, 87);
      doc.text(customer?.email || "", margin, 92);

      // Shipping info
      if (shipping_address) {
        doc.text(`${shipping_address.street}`, pageWidth / 2, 87);
        doc.text(
          `${shipping_address.city}, ${shipping_address.postal_code}`,
          pageWidth / 2,
          92,
        );
        doc.text(`${shipping_address.country}`, pageWidth / 2, 97);
        doc.text(
          `${t("Phone")}: ${shipping_address.phone_no}`,
          pageWidth / 2,
          102,
        );
      } else {
        doc.text(t("No shipping address provided"), pageWidth / 2, 87);
      }

      // 4. Items Table
      autoTable(doc, {
        startY: 115,
        margin: { left: margin, right: margin },
        head: [
          [
            t("#"),
            t("Product Name"),
            { content: t("Qty"), styles: { halign: "center" } },
            { content: t("Unit Price"), styles: { halign: "right" } },
            { content: t("Total"), styles: { halign: "right" } },
          ],
        ],
        body: (Array.isArray(order_items) ? order_items : []).map(
          (item, index) => {
            const productName =
              typeof item.product?.product_name === "string"
                ? item.product.product_name
                : item.product?.product_name?.[currentLanguage] ||
                  item.product?.product_name?.en ||
                  t("Unknown Product");

            return [
              index + 1,
              productName,
              { content: item.quantity || 0, styles: { halign: "center" } },
              {
                content: `${(item.price || 0).toFixed(2)} DH`,
                styles: { halign: "right" },
              },
              {
                content: `${((item.quantity || 0) * (item.price || 0)).toFixed(
                  2,
                )} DH`,
                styles: { halign: "right" },
              },
            ];
          },
        ),
        theme: "striped",
        headStyles: {
          fillColor: brandColor,
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 4,
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: 50,
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 20 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
        },
      });

      // 5. Totals
      const finalY = doc.lastAutoTable.finalY + 10;
      const subtotal = (Array.isArray(order_items) ? order_items : []).reduce(
        (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
        0,
      );

      const totalsData = [
        [t("Subtotal"), `${subtotal.toFixed(2)} DH`],
        [t("Shipping"), `${(shipping_price || 0).toFixed(2)} DH`],
        [t("Tax"), `${(tax || 0).toFixed(2)} DH`],
        [t("Discount"), `-${(coupon_discount || 0).toFixed(2)} DH`],
        [
          {
            content: t("TOTAL"),
            styles: { fontStyle: "bold", fontSize: 12, textColor: brandColor },
          },
          {
            content: `${(cart_total_price || 0).toFixed(2)} DH`,
            styles: { fontStyle: "bold", fontSize: 12, textColor: brandColor },
          },
        ],
      ];

      autoTable(doc, {
        startY: finalY,
        margin: { left: pageWidth / 2 },
        body: totalsData,
        theme: "plain",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: "right",
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 45 },
        },
      });

      // 6. Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      const footerY = pageHeight - 30;
      doc.text(
        t("thank_you_message") || "Thank you for shopping with Greenville!",
        pageWidth / 2,
        footerY,
        { align: "center" },
      );
      doc.text(
        t("support_message") ||
          "For questions, contact us at support@greenville.ma",
        pageWidth / 2,
        footerY + 5,
        { align: "center" },
      );

      // Bottom Bar
      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.rect(0, pageHeight - 10, pageWidth, 10, "F");

      doc.save(
        `Invoice_${customerFullName.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      );
      toast.success(t("Invoice downloaded successfully"));
      setIsConfirmOpen(false);
    } catch (error) {
      alert(error);
      console.error("Error generating invoice:", error);
      toast.error(t("Failed to download invoice"));
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "canceled":
        return "destructive";
      case "processing":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getShippingStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "in_transit":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <TableRow
        className={`group transition-colors ${
          selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-gray-50/50"
        }`}
      >
        <TableCell className="pl-6 py-4">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => handleClick({ target: { checked } })}
            aria-label={`Select order ${customerFullName}`}
            className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </TableCell>

        <TableCell className="py-4">
          <span className="font-mono text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">
            #{id.toString().slice(-5).toUpperCase()}
          </span>
        </TableCell>

        <TableCell className="py-4">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{customerFullName}</span>
            <span className="text-xs text-gray-500">{customer?.email}</span>
          </div>
        </TableCell>

        <TableCell className="py-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600">
            {order_items.length} {t("Products")}
          </span>
        </TableCell>

        <TableCell className="py-4">
          <span className="font-bold text-gray-900">{cart_total_price} DH</span>
        </TableCell>

        <TableCell className="py-4">
          <span className="text-sm text-gray-600">{fDateTime(order_date)}</span>
        </TableCell>

        <TableCell className="py-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-lg">
            {t(shipping_method)}
          </span>
        </TableCell>

        <TableCell className="py-4">
          <Badge
            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border-none ${getShippingStatusColor(
              shipping_status,
            )}`}
          >
            {t(shippingStatusLabel)}
          </Badge>
        </TableCell>

        <TableCell className="py-4">
          {delivery_boy ? (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {`${delivery_boy.first_name} ${delivery_boy.last_name}`}
              </span>
              <span className="text-[10px] text-gray-500">
                {delivery_boy.email}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">
              {t("Not assigned")}
            </span>
          )}
        </TableCell>

        <TableCell className="py-4">
          <Badge
            variant={getStatusVariant(status)}
            className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider"
          >
            {t(status)}
          </Badge>
        </TableCell>

        <TableCell className="py-4 pr-6 text-right">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-gray-400 hover:text-primary transition-all"
              >
                <Iconify icon="eva:more-vertical-fill" width={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 p-2 rounded-2xl shadow-xl border-none"
              align="end"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-gray-600 hover:text-primary hover:bg-primary/5 px-3 py-2"
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
                  <Iconify icon="eva:eye-fill" width={18} />
                  {t("Details")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-gray-600 hover:text-primary hover:bg-primary/5 px-3 py-2"
                  onClick={onEdit}
                >
                  <Iconify icon="eva:edit-fill" width={18} />
                  {t("Edit")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <Iconify icon="material-symbols-light:download" width={18} />
                  {t("Download Invoice")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 px-3 py-2"
                  onClick={onDelete}
                >
                  <Iconify icon="eva:trash-2-outline" width={18} />
                  {t("Delete")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Invoice Download Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none">
          <DialogHeader>
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Iconify
                icon="material-symbols-light:description-outline-rounded"
                width={32}
                height={32}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("Download Invoice")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-base leading-relaxed">
              {t("download_confirmation_desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              disabled={isDownloading}
              onClick={generatePDF}
              className="w-full h-12 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Generating PDF...")}
                </div>
              ) : (
                t("Yes, Download")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full h-12 bg-gray-50 text-gray-600 font-bold border-none rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              {t("Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

OrderTableRow.propTypes = {
  id: PropTypes.string,
  handleClick: PropTypes.func,
  customer: PropTypes.object,
  order_items: PropTypes.array,
  cart_total_price: PropTypes.number,
  order_date: PropTypes.string,
  shipping_method: PropTypes.string,
  shipping_status: PropTypes.string,
  status: PropTypes.string,
  delivery_boy: PropTypes.object,
  shipping_price: PropTypes.number,
  tax: PropTypes.number,
  coupon_discount: PropTypes.number,
  shipping_address: PropTypes.object,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
