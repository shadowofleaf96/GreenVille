import PropTypes from "prop-types";
import { TableRow, TableCell } from "@/components/ui/table";

// ----------------------------------------------------------------------

export default function TableEmptyRows({ emptyRows, height, colSpan = 9 }) {
  if (!emptyRows || emptyRows <= 0) {
    return null;
  }

  return (
    <TableRow
      style={{
        ...(height && {
          height: height * emptyRows,
        }),
      }}
      className="hover:bg-transparent"
    >
      <TableCell colSpan={colSpan} />
    </TableRow>
  );
}

TableEmptyRows.propTypes = {
  emptyRows: PropTypes.number,
  height: PropTypes.number,
  colSpan: PropTypes.number,
};
