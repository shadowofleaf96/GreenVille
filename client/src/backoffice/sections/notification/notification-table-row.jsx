import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

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
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">{t(subject)}</Typography>
      </TableCell>

      <TableCell>{t(sendType)}</TableCell>

      <TableCell>
        <Typography variant="body2">{recipients.join(", ")}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{new Date(dateSent).toLocaleString()}</Typography>
      </TableCell>

      <TableCell align="center">
        <IconButton onClick={onDetails}>
          <Iconify icon="material-symbols-light:visibility-outline-rounded" width={26} height={26} />
        </IconButton>

        <IconButton onClick={onDelete} sx={{ color: "error.main" }}>
          <Iconify icon="material-symbols-light:delete-outline-rounded" width={28} height={28} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

NotificationTableRow.propTypes = {
  selected: PropTypes.bool,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string,
  sendType: PropTypes.string.isRequired,
  recipients: PropTypes.array.isRequired,
  dateSent: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
};
