import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  TableHeader,
  TableRow,
  TableHead as ShadcnTableHead,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Iconify from "../../../components/iconify";

export default function ContactTableHead({
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
    <TableHeader className="bg-gray-50/50 border-y border-gray-100">
      <TableRow className="hover:bg-transparent">
        <ShadcnTableHead className="w-12 px-4">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onCheckedChange={(checked) => {
              onSelectAllClick({ target: { checked } });
            }}
          />
        </ShadcnTableHead>

        {headLabel.map((headCell) => (
          <ShadcnTableHead
            key={headCell.id}
            className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs"
            style={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.id !== "" ? (
              <button
                onClick={onSort(headCell.id)}
                className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none group"
              >
                {headCell.label}
                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                  <Iconify
                    icon={
                      orderBy === headCell.id && order === "asc"
                        ? "material-symbols:arrow-drop-up-rounded"
                        : "material-symbols:arrow-drop-down-rounded"
                    }
                    width={20}
                    className={
                      orderBy === headCell.id
                        ? "text-primary opacity-100"
                        : "text-gray-400"
                    }
                  />
                </div>
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

ContactTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
