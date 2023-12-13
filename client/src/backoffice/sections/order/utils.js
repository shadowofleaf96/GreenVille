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

export function applyFilter({
  inputData,
  comparator,
  filterName,
  itemsFilter,
  totalPriceFilter,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter((order) => {
      const firstCustomerNameMatch =
        order?.customer.first_name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1;
      const lastCustomerNameMatch =
        order?.customer.last_name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1;
      return firstCustomerNameMatch || lastCustomerNameMatch;
    });
  }

  if (itemsFilter) {
    inputData = inputData.filter((order) => {
      const orderItemsMatch = order.order_items.some((item) =>
        item.product.product_name
          .toLowerCase()
          .includes(itemsFilter.toLowerCase())
      );
      return orderItemsMatch;
    });
  }

  if (totalPriceFilter) {
    inputData = inputData.filter((order) => {
      const orderTotalPriceMatch = order.cart_total_price
        .toString()
        .toLowerCase()
        .includes(totalPriceFilter.toLowerCase());
      return orderTotalPriceMatch;
    });
  }

  return inputData;
}
