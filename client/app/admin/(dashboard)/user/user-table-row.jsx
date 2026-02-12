import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

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
import { fDateTime } from "@/utils/format-time";

import Iconify from "@/components/shared/iconify";

export default function UserTableRow({
  selected,
  user_image,
  first_name,
  last_name,
  role,
  user_name,
  creation_date,
  status,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t } = useTranslation();
  const admin = useSelector((state) => state.adminAuth.admin);
  const isActive = status;

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
        <Avatar className="w-10 h-10">
          <AvatarImage src={user_image} alt={`${first_name} ${last_name}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {first_name?.[0]}
            {last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </TableCell>

      <TableCell className="font-medium">{first_name}</TableCell>

      <TableCell className="font-medium">{last_name}</TableCell>

      <TableCell>
        <span className="text-sm text-gray-600">{t(role)}</span>
      </TableCell>

      <TableCell>
        <span className="text-sm text-gray-600">{user_name}</span>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-500">
          {fDateTime(creation_date)}
        </span>
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
                onClick={() =>
                  onDetails({
                    first_name,
                    last_name,
                    user_name,
                    status,
                    creation_date,
                  })
                }
              >
                <Iconify icon="eva:eye-fill" width={18} />
                {t("Details")}
              </Button>

              {admin?.role !== "manager" && (
                <>
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
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  user_image: PropTypes.string,
  handleClick: PropTypes.func,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  role: PropTypes.string,
  user_name: PropTypes.string,
  creation_date: PropTypes.number,
  status: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};

