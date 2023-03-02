function isValidDateTime(s) {
  return new Date(s).toString() === 'Invalid Date' ? "^Invalid date time" : true;
}

module.exports = isValidDateTime;
