module.exports = async function getPagingData(data, page, limit) {
  const { count: totalItems, rows: response } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, response, totalPages, currentPage };
};
