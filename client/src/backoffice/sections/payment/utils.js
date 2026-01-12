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
export function getComparator(payment, orderBy) {
  return payment === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({
  inputData,
  comparator,
  filterName,
  paymentMethodFilter,
  totalPriceFilter,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const payment = comparator(a[0], b[0]);
    if (payment !== 0) return payment;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter((payment) => {
      const firstNameMatch =
        payment.order.customer_id.first_name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1;
      const lastNameMatch =
        payment.order.customer_id.last_name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1;

      return firstNameMatch || lastNameMatch;
    });
  }

  if (paymentMethodFilter) {
    inputData = inputData.filter((payment) => {
      const MethodMatch = payment.paymentMethod.includes(paymentMethodFilter);
      return MethodMatch;
    });
  }

  if (totalPriceFilter) {
    inputData = inputData.filter((payment) => {
      const orderTotalPriceMatch = payment.amount
        .toString()
        .toLowerCase()
        .includes(totalPriceFilter.toLowerCase());
      return orderTotalPriceMatch;
    });
  }

  return inputData;
}
