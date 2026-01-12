import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Iconify from "../../../components/iconify";

export default function ProductTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const { t } = useTranslation("login-view");

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const renderSortIcon = (headCell) => {
    if (orderBy !== headCell.id) return null;
    return order === "desc" ? (
      <ArrowUpDown className="ml-1 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-1 h-4 w-4 transform rotate-180" />
    );
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
            onClick={createSortHandler(headCell.id)}
            style={{
              width: headCell.width,
              minWidth: headCell.minWidth,
            }}
          >
            <div
              className={`flex items-center gap-2 ${
                headCell.align === "center" ? "justify-center" : ""
              } ${headCell.align === "right" ? "justify-end" : ""}`}
            >
              <span className="font-bold text-gray-700">
                {t(headCell.label)}
              </span>
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
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

ProductTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
