import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Badge from '@mui/material/Badge';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../../utils/format-time';

export default function ProductTableRow({
  selected,
  product_images,
  sku,
  product_name,
  short_description,
  price,
  quantity,
  discount_price,
  option,
  creation_date,
  status,
  handleClick,
  onEdit,
  onDelete,
  onDetails,
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [open, setOpen] = useState(null);
  const isActive = status;
  const color = isActive ? 'primary' : 'secondary';

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell align="center">
          <Avatar alt={product_name[currentLanguage]} src={product_images} />
        </TableCell>

        <TableCell>{sku}</TableCell>

        <TableCell>{product_name[currentLanguage]}</TableCell>

        <TableCell>{`${price} ${t('DH')}`}</TableCell>

        <TableCell>{quantity}</TableCell>

        <TableCell>{fDateTime(creation_date)}</TableCell>

        <TableCell>
          <Badge
            sx={{
              minWidth: 24,
            }}
            badgeContent={isActive ? t('Active') : t('Inactive')}
            color={color}
          ></Badge>
        </TableCell>

        <TableCell align="center">
          <IconButton
            onClick={() =>
              onDetails({
                product_images,
                sku,
                product_name,
                short_description,
                quantity,
                price,
                discount_price,
                option,
                creation_date,
                status,
              })
            }
          >
            <Iconify
              icon="material-symbols-light:visibility-outline-rounded"
              width={26}
              height={26}
            />
          </IconButton>

          <IconButton onClick={onEdit && onEdit}>
            <Iconify
              icon="material-symbols-light:edit-outline-rounded"
              width={28}
              height={28}
            />
          </IconButton>

          <IconButton
            onClick={(event) => onDelete && onDelete(event)}
            sx={{ color: 'error.main' }}
          >
            <Iconify
              icon="material-symbols-light:delete-outline-rounded"
              width={28}
              height={28}
            />
          </IconButton>
        </TableCell>
      </TableRow >
    </>
  );
}

ProductTableRow.propTypes = {
  handleClick: PropTypes.func,
  product_images: PropTypes.string,
  sku: PropTypes.string,
  product_name: PropTypes.object,
  short_description: PropTypes.object,
  price: PropTypes.number,
  quantity: PropTypes.number,
  option: PropTypes.array,
  creation_date: PropTypes.number,
  status: PropTypes.bool,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
};
