import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { fDateTime } from "@/utils/format-time";
import Iconify from "@/components/shared/iconify";

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

export default function CustomerTableRow({
  selected,
  customer_image,
  first_name,
  last_name,
  email,
  creation_date,
  status,
  last_login,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t } = useTranslation();
  const isActive = status;

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
          aria-label={`Select ${first_name} ${last_name}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
            <AvatarImage
              src={customer_image}
              alt={`${first_name} ${last_name}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {first_name?.charAt(0)}
              {last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </TableCell>

      <TableCell className="py-4 font-medium text-gray-900">
        {first_name}
      </TableCell>

      <TableCell className="py-4 font-medium text-gray-900">
        {last_name}
      </TableCell>

      <TableCell className="py-4 text-gray-600">{email}</TableCell>

      <TableCell className="py-4 text-gray-600 font-medium">
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
                onClick={() =>
                  onDetails({
                    first_name,
                    last_name,
                    email,
                    status,
                    creation_date,
                    last_login,
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

CustomerTableRow.propTypes = {
  customer_image: PropTypes.string,
  handleClick: PropTypes.func,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  email: PropTypes.string,
  creation_date: PropTypes.number,
  status: PropTypes.bool,
  last_login: PropTypes.number,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};

