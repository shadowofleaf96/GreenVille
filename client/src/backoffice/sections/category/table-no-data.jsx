import React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h6" paragraph>
            Not found
          </Typography>

          {query ? (
            // Display this message when query is not empty
            <Typography variant="body2">
              No results found for &nbsp;
              <strong>&quot;{query}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Typography>
          ) : (
            // Display this message when query is empty
            <Typography variant="body2">No Categories found</Typography>
          )}
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
