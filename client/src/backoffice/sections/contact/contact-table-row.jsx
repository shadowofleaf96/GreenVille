import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; 

import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function ContactTableRow({
  selected,
  name,
  email,
  phone_number,
  message,
  handleClick,
  onReply,
  onEdit,
  onDelete,
}) {

  const { t } = useTranslation();


  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={handleClick}
          />
        </TableCell>

        <TableCell>{t(name)}</TableCell>

        {<TableCell>{email}</TableCell>}

        <TableCell>{t(phone_number)}</TableCell>

        <TableCell>{t(message)}</TableCell>

        <TableCell align="center">
          <IconButton
            onClick={(event) => {
              onReply && onReply(event);
            }}
          >
            <Iconify
              icon="material-symbols-light:reply-rounded"
              width={28}
              height={28}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              onEdit && onEdit();
            }}
          >
            <Iconify
              icon="material-symbols-light:edit-outline-rounded"
              width={28}
              height={28}
            />
          </IconButton>

          <IconButton
            onClick={(event) => {
              onDelete && onDelete(event);
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify
              icon="material-symbols-light:delete-outline-rounded"
              width={28}
              height={28}
            />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}

ContactTableRow.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.string,
  email: PropTypes.string,
  phone_number: PropTypes.string,
  message: PropTypes.string,
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReply: PropTypes.func,
};
