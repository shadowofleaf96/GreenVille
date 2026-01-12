import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Iconify from "../../../components/iconify";

export default function UserTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const { t } = useTranslation();

  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeader>
      <TableRow className="border-b border-gray-200">
        <TableHead className="w-12">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onCheckedChange={(checked) => {
              onSelectAllClick({
                target: { checked },
              });
            }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
          />
        </TableHead>

        {headLabel.map((headCell) => (
          <TableHead
            key={headCell.id}
            className="cursor-pointer select-none group"
            onClick={onSort(headCell.id)}
            style={{
              width: headCell.width,
              minWidth: headCell.minWidth,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">{headCell.label}</span>
              {orderBy === headCell.id && (
                <Iconify
                  icon={
                    order === "asc"
                      ? "material-symbols:arrow-upward-rounded"
                      : "material-symbols:arrow-downward-rounded"
                  }
                  width={16}
                  height={16}
                  className="text-primary"
                />
              )}
            </div>
            {orderBy === headCell.id && (
              <span className="sr-only">
                {order === "desc"
                  ? t("sortedDescending")
                  : t("sortedAscending")}
              </span>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

UserTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
