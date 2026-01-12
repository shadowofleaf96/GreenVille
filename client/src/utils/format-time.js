import { format, getTime, formatDistanceToNow } from "date-fns";

// ----------------------------------------------------------------------

const formatDayMonth = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

const formatDate = (dateString) => {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

export function fDate(date, newFormat) {
  const fm = newFormat || "MM/dd/yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date) {
  return date ? formatDate(new Date(date)) : "";
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}

export function fDayMonth(date) {
  return date ? formatDayMonth(date) : "";
}
