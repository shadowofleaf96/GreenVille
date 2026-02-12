import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Iconify from "@/components/shared/iconify";

export default function PaymentTableRow({
  selected,
  ordererName,
  amount,
  paymentMethod,
  currency,
  createdAt,
  paymentStatus,
  handleClick,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <TableRow
      className={`group transition-colors ${
        selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-gray-50/50"
      }`}
    >
      <TableCell className="pl-6 py-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => handleClick({ target: { checked } })}
          aria-label={`Select payment by ${ordererName}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4">
        <span
          className="font-bold text-gray-900 line-clamp-1 max-w-[200px]"
          title={ordererName}
        >
          {ordererName}
        </span>
      </TableCell>

      <TableCell className="py-4 font-black text-gray-900">
        {parseFloat(amount).toFixed(2)}{" "}
        {currency === "usd" ? "$" : currency.toUpperCase()}
      </TableCell>

      <TableCell className="py-4 capitalize">
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
          {t(paymentMethod)}
        </span>
      </TableCell>

      <TableCell className="py-4 uppercase text-xs font-black text-gray-400">
        {currency}
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {new Date(createdAt).toLocaleString()}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <Badge
          variant={getStatusVariant(paymentStatus)}
          className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider"
        >
          {t(paymentStatus)}
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
            className="w-40 p-2 rounded-2xl shadow-xl border-none"
            align="end"
          >
            <div className="flex flex-col gap-1">
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
  );
}

PaymentTableRow.propTypes = {
  selected: PropTypes.bool,
  ordererName: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paymentMethod: PropTypes.string,
  currency: PropTypes.string,
  createdAt: PropTypes.string,
  paymentStatus: PropTypes.string,
  handleClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

