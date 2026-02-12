import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";
import { fDateTime } from "@/utils/format-time";

import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProductTableRow({
  selected,
  product_images,
  sku,
  product_name,
  short_description,
  price,
  quantity,
  discount_price,
  option,
  creation_date,
  status,
  on_sale,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  const isActive = status;

  return (
    <TableRow
      className={`
        group transition-all duration-200 
        ${selected ? "bg-primary/5" : "hover:bg-gray-50/80 bg-white"}
        border-b border-gray-100 last:border-0
      `}
    >
      <TableCell className="p-4 w-12 text-center">
        <Checkbox
          checked={selected}
          onCheckedChange={handleClick}
          className="w-4 h-4"
        />
      </TableCell>

      <TableCell className="p-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-1 shadow-sm group-hover:scale-110 transition-transform duration-200">
            <img
              alt={
                typeof product_name === "string"
                  ? product_name
                  : product_name?.[currentLanguage] || product_name?.en || ""
              }
              src={product_images}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/assets/images/products/product_default.jpg";
              }}
            />
          </div>
        </div>
      </TableCell>

      <TableCell className="p-4">
        <span className="text-sm font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
          {sku}
        </span>
      </TableCell>

      <TableCell className="p-4 text-sm font-semibold text-gray-800">
        {typeof product_name === "string"
          ? product_name
          : product_name?.[currentLanguage] || product_name?.en || ""}
      </TableCell>

      <TableCell className="p-4 text-sm font-bold text-primary whitespace-nowrap">
        {`${price} ${t("DH")}`}
      </TableCell>

      <TableCell className="p-4 text-sm font-medium text-gray-600">
        <Badge
          variant={quantity < 10 ? "secondary" : "primary"}
          className="font-bold"
        >
          {quantity}
        </Badge>
      </TableCell>

      <TableCell className="p-4 text-xs font-medium text-gray-400 whitespace-nowrap">
        {fDateTime(creation_date)}
      </TableCell>

      <TableCell className="py-4">
        <Badge
          variant={isActive ? "success" : "destructive"}
          className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${
            isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
              : "bg-red-100 text-red-700 hover:bg-red-100 border-none"
          }`}
        >
          {isActive ? t("Active") : t("Inactive")}
        </Badge>
        {on_sale && (
          <Badge className="ml-2 px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider bg-primary/10 text-primary border-none shadow-sm shadow-primary/5 select-none">
            {t("On Sale")}
          </Badge>
        )}
      </TableCell>

      <TableCell className="p-4 text-right">
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
            className="w-40 p-2 rounded-2xl shadow-xl border-none"
            align="end"
          >
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-gray-600 hover:text-primary hover:bg-primary/5 px-3 py-2"
                onClick={() =>
                  onDetails({
                    product_images,
                    sku,
                    product_name,
                    short_description,
                    quantity,
                    price,
                    discount_price,
                    option,
                    creation_date,
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
                className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 px-3 py-2"
                onClick={(event) => onDelete && onDelete(event)}
              >
                <Iconify icon="eva:trash-2-outline" width={18} />
                {t("Delete")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

ProductTableRow.propTypes = {
  handleClick: PropTypes.func,
  product_images: PropTypes.string,
  sku: PropTypes.string,
  product_name: PropTypes.object,
  short_description: PropTypes.object,
  price: PropTypes.number,
  quantity: PropTypes.number,
  discount_price: PropTypes.number,
  option: PropTypes.array,
  creation_date: PropTypes.number,
  status: PropTypes.bool,
  on_sale: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
