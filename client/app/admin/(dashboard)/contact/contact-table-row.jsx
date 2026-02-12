import PropTypes from "react";
import { useTranslation } from "react-i18next";

import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Iconify from "@/components/shared/iconify";

export default function ContactTableRow({
  selected,
  name,
  email,
  phone_number,
  message,
  handleClick,
  onReply,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  return (
    <TableRow
      className={`group hover:bg-gray-50 transition-colors ${
        selected ? "bg-primary/5" : ""
      }`}
    >
      <TableCell className="w-12 px-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => {
            handleClick({ target: { checked } });
          }}
        />
      </TableCell>

      <TableCell className="py-4">
        <span className="font-bold text-gray-900 line-clamp-1">{t(name)}</span>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm font-medium text-gray-600 truncate max-w-[200px] block">
          {email}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {t(phone_number)}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <span
          className="text-sm text-gray-500 line-clamp-1 max-w-[300px]"
          title={t(message)}
        >
          {t(message)}
        </span>
      </TableCell>

      <TableCell className="py-4 pr-4 text-right">
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
                onClick={onReply}
              >
                <Iconify
                  icon="material-symbols-light:reply-rounded"
                  width={18}
                />
                {t("Reply")}
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

ContactTableRow.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.string,
  email: PropTypes.string,
  phone_number: PropTypes.string,
  message: PropTypes.string,
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReply: PropTypes.func,
};

