import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { fDateTime } from "../../../utils/format-time";
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

export default function LocalizationTableRow({
  selected,
  rowKey,
  en,
  fr,
  ar,
  updatedAt,
  handleClick,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

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
          aria-label={`Select ${rowKey}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4 font-mono text-xs font-bold text-primary">
        {rowKey}
      </TableCell>

      <TableCell
        className="py-4 text-sm text-gray-600 max-w-[200px] truncate"
        title={typeof en === "object" ? JSON.stringify(en) : en}
      >
        {typeof en === "object" ? (
          <Badge
            variant="outline"
            className="font-mono text-[10px] bg-gray-50 text-gray-400 border-gray-200"
          >
            Object {JSON.stringify(en).slice(0, 10)}...
          </Badge>
        ) : (
          en
        )}
      </TableCell>

      <TableCell
        className="py-4 text-sm text-gray-600 max-w-[200px] truncate"
        title={typeof fr === "object" ? JSON.stringify(fr) : fr}
      >
        {typeof fr === "object" ? (
          <Badge
            variant="outline"
            className="font-mono text-[10px] bg-gray-50 text-gray-400 border-gray-200"
          >
            Object {JSON.stringify(fr).slice(0, 10)}...
          </Badge>
        ) : (
          fr
        )}
      </TableCell>

      <TableCell
        className="py-4 text-sm text-gray-600 max-w-[200px] truncate text-right font-arabic"
        dir="rtl"
        title={typeof ar === "object" ? JSON.stringify(ar) : ar}
      >
        {typeof ar === "object" ? (
          <Badge
            variant="outline"
            className="font-mono text-[10px] bg-gray-50 text-gray-400 border-gray-200"
          >
            ...{JSON.stringify(ar).slice(-10)} Object
          </Badge>
        ) : (
          ar
        )}
      </TableCell>

      <TableCell className="py-4 text-gray-500 font-medium text-xs">
        {fDateTime(updatedAt)}
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

LocalizationTableRow.propTypes = {
  rowKey: PropTypes.string,
  en: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  fr: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  updatedAt: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
