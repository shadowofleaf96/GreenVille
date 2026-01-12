import React from "react";
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
import Iconify from "../../../components/iconify";

export default function ReviewTableRow({
  selected,
  product,
  customer,
  rating,
  comment,
  review_date,
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
          aria-label={`Select review by ${customer}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4">
        <span
          className="font-bold text-gray-900 line-clamp-1 max-w-[200px]"
          title={product}
        >
          {product}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <span className="font-medium text-gray-700">{customer}</span>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg w-fit">
          <Iconify icon="material-symbols:star-rounded" width={16} />
          <span className="font-bold text-sm">{rating}</span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <p
          className="text-sm text-gray-600 line-clamp-2 max-w-[300px]"
          title={comment}
        >
          {comment}
        </p>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {review_date}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <Badge
          variant={isActive ? "success" : "secondary"}
          className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider"
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

ReviewTableRow.propTypes = {
  handleClick: PropTypes.func,
  product: PropTypes.string,
  customer: PropTypes.string,
  rating: PropTypes.number,
  comment: PropTypes.string,
  review_date: PropTypes.string,
  status: PropTypes.string,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
