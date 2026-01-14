import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Iconify from "../../../components/iconify";

export default function CategoryTableRow({
  selected,
  category_image,
  category_name,
  handleClick,
  status,
  onEdit,
  onDelete,
  onDetails, // eslint-disable-line no-unused-vars
}) {
  const { t, i18n } = useTranslation();
  const isActive = status;
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  return (
    <TableRow
      className={`hover:bg-gray-50 transition-colors ${
        selected ? "bg-primary/5" : ""
      }`}
    >
      <TableCell className="w-12">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => {
            handleClick({ target: { checked } });
          }}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 rounded-lg">
            <AvatarImage
              src={category_image || ""}
              alt={
                typeof category_name === "string"
                  ? category_name
                  : category_name?.[currentLanguage] ||
                    category_name?.["en"] ||
                    ""
              }
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-lg">
              {(typeof category_name === "string"
                ? category_name
                : category_name?.[currentLanguage] ||
                  category_name?.["en"] ||
                  "C")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">
            {typeof category_name === "string"
              ? category_name
              : category_name?.[currentLanguage] || category_name?.["en"] || ""}
          </span>
        </div>
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

      <TableCell className="text-right">
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
                onClick={() => {
                  onEdit && onEdit();
                }}
              >
                <Iconify icon="eva:edit-fill" width={18} />
                {t("Edit")}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 px-3 py-2"
                onClick={(event) => {
                  onDelete && onDelete(event);
                }}
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

CategoryTableRow.propTypes = {
  category_name: PropTypes.object,
  category_image: PropTypes.string,
  status: PropTypes.bool,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
