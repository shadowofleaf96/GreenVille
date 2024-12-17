// Shadow Of Leaf was Here
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function PaymentTableHead({
  payment,
  paymentBy,
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
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={paymentBy === headCell.id ? payment : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={paymentBy === headCell.id}
              direction={paymentBy === headCell.id ? payment : 'asc'}
              onClick={onSort(headCell.id)}
            >
              {t(headCell.label)} 
              {paymentBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {payment === 'desc'
                    ? t('sorted descending')
                    : t('sorted ascending')}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

PaymentTableHead.propTypes = {
  payment: PropTypes.oneOf(['asc', 'desc']),
  paymentBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
