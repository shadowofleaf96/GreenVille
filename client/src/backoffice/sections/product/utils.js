export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// utils.js

export function applyFilter({ inputData, comparator, filterName, skuFilter, priceFilter, quantityFilter }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((product) => {
      const productNameMatch =
        product.product_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;

      return productNameMatch;
    });
  }

  if (skuFilter) {
    inputData = inputData.filter((product) => {
      const skuMatch = product.sku.toLowerCase().indexOf(skuFilter.toLowerCase()) !== -1;

      return skuMatch;
    });
  }

  if (priceFilter) {
    inputData = inputData.filter((product) => {
      const priceMatch = product.price.toString().indexOf(priceFilter) !== -1;

      return priceMatch;
    });
  }

  if (quantityFilter) {
    inputData = inputData.filter((product) => {
      const quantityMatch = product.quantity.toString().indexOf(quantityFilter) !== -1;

      return quantityMatch;
    });
  }

  return inputData;
}
