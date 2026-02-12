import PropTypes from "prop-types";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";

export default function LocalizationTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const { t } = useTranslation(); // eslint-disable-line no-unused-vars
  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b border-gray-100">
        <TableHead className="w-[50px] pl-6">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onCheckedChange={(checked) =>
              onSelectAllClick({ target: { checked } })
            }
            aria-label="Select all"
            className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </TableHead>

        {headLabel.map((headCell) => (
          <TableHead
            key={headCell.id}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="font-bold text-gray-900 text-xs uppercase tracking-wider h-14"
          >
            <div
              className={`flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors ${
                headCell.align === "center" ? "justify-center" : ""
              } ${headCell.align === "right" ? "justify-end" : ""}`}
              onClick={onSort(headCell.id)}
            >
              <span>{headCell.label}</span>
              {orderBy === headCell.id ? (
                <Iconify
                  icon={
                    order === "desc"
                      ? "material-symbols:arrow-downward-rounded"
                      : "material-symbols:arrow-upward-rounded"
                  }
                  width={16}
                />
              ) : (
                headCell.id !== "" && (
                  <Iconify
                    icon="material-symbols:unfold-more-rounded"
                    width={16}
                    className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

LocalizationTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

