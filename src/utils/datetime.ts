export const datetimeUtils = {
  startOfThisMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  },

  endOfThisMonth(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
  },

  startOfLastMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0, 0);
  },

  endOfLastMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
  },

  startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
};
