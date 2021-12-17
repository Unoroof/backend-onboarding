module.exports = async (startDate, endDate) => {
  try {
    const dateFrom = new Date(startDate);
    const dateTo = new Date(endDate);
    const months =
      dateTo.getMonth() -
      dateFrom.getMonth() +
      12 * (dateTo.getFullYear() - dateFrom.getFullYear());
    return {
      year: parseInt(months / 12),
      month: months % 12,
    };
  } catch (error) {
    console.log("error in calculating Tenor", error);
  }
};
