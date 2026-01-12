import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TableHead as ShadcnTableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CouponTableHead({
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
    <TableHeader className="bg-gray-50/50 text-gray-500">
      <TableRow className="hover:bg-transparent border-none">
        <ShadcnTableHead className="w-[50px] pl-6 py-4">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onCheckedChange={(checked) =>
              onSelectAllClick({ target: { checked } })
            }
            aria-label="Select all"
            className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </ShadcnTableHead>

        {headLabel.map((headCell) => (
          <ShadcnTableHead
            key={headCell.id}
            className={`py-4 font-bold text-gray-600 text-[13px] uppercase tracking-wider ${
              headCell.align === "center" ? "text-center" : "text-left"
            }`}
            style={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.id ? (
              <button
                onClick={onSort(headCell.id)}
                className={`inline-flex items-center gap-1.5 hover:text-primary transition-colors group ${
                  headCell.align === "center" ? "justify-center" : ""
                }`}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Iconify
                    icon={
                      order === "desc"
                        ? "material-symbols:arrow-downward-rounded"
                        : "material-symbols:arrow-upward-rounded"
                    }
                    className="text-primary"
                    width={16}
                  />
                ) : (
                  <Iconify
                    icon="material-symbols:unfold-more-rounded"
                    className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    width={16}
                  />
                )}
              </button>
            ) : (
              headCell.label
            )}
          </ShadcnTableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

CouponTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
