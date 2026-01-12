import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CouponTableRow({
  selected,
  code,
  discount,
  expiresAt,
  usageLimit,
  status,
  handleClick,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  const isActive = status === "active";

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
          aria-label={`Select ${code}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4 font-bold text-gray-900">{code}</TableCell>

      <TableCell className="py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
          {discount}% OFF
        </span>
      </TableCell>

      <TableCell className="py-4 text-gray-600 font-medium">
        {expiresAt}
      </TableCell>

      <TableCell className="py-4 text-gray-600 font-medium">
        {usageLimit}
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

CouponTableRow.propTypes = {
  handleClick: PropTypes.func,
  code: PropTypes.string,
  discount: PropTypes.number,
  expiresAt: PropTypes.string,
  usageLimit: PropTypes.number,
  status: PropTypes.string,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
