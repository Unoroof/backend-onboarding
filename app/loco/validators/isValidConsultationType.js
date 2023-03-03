function isValidConsultationType(s) {
  return !['live', "future_date"].includes(s) ? "^Invalid consultation type" : true;
}

module.exports = isValidConsultationType;
