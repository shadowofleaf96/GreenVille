import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Iconify from "@/components/shared/iconify";

export default function CategoryTableHead({
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

  const translatedHeadLabel = headLabel.map((headCell) => {
    return {
      ...headCell,
      label: t(headCell.label),
    };
  });

  return (
    <TableHeader className="bg-gray-50/50 border-y border-gray-100">
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-12 px-4">
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

        {translatedHeadLabel.map((headCell) => (
          <TableHead
            key={headCell.id}
            className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs select-none"
            onClick={onSort(headCell.id)}
            style={{
              width: headCell.width,
              minWidth: headCell.minWidth,
            }}
          >
            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group">
              <span>{headCell.label}</span>
              {headCell.id !== "" && (
                <div className="flex flex-col">
                  {orderBy === headCell.id ? (
                    <Iconify
                      icon={
                        order === "asc"
                          ? "material-symbols:arrow-drop-up-rounded"
                          : "material-symbols:arrow-drop-down-rounded"
                      }
                      width={20}
                      className="text-primary"
                    />
                  ) : (
                    <Iconify
                      icon="material-symbols:unfold-more-rounded"
                      width={20}
                      className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
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

CategoryTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

