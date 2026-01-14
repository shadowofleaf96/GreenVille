import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Iconify from "../../../components/iconify";

export default function NotificationTableRow({
  selected,
  subject,
  sendType,
  recipients,
  dateSent,
  handleClick,
  onDelete,
  onDetails,
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
          aria-label={`Select notification: ${subject}`}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </TableCell>

      <TableCell className="py-4">
        <span
          className="font-bold text-gray-900 line-clamp-1 max-w-[250px]"
          title={t(subject)}
        >
          {t(subject)}
        </span>
      </TableCell>

      <TableCell className="py-4 capitalize">
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
          {t(sendType)}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <p
          className="text-sm text-gray-600 line-clamp-1 max-w-[200px]"
          title={recipients.join(", ")}
        >
          {recipients.join(", ")}
        </p>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {new Date(dateSent).toLocaleString()}
        </span>
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
                onClick={onDetails}
              >
                <Iconify icon="eva:eye-fill" width={18} />
                {t("Details")}
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

NotificationTableRow.propTypes = {
  selected: PropTypes.bool,
  subject: PropTypes.string.isRequired,
  sendType: PropTypes.string.isRequired,
  recipients: PropTypes.array.isRequired,
  dateSent: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
};
