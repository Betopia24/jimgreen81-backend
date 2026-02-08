function startOfThisMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfThisMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
}

function startOfLastMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function endOfLastMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
}

export const datetimeUtils = {
  startOfThisMonth,
  endOfThisMonth,
  startOfLastMonth,
  endOfLastMonth,
};
