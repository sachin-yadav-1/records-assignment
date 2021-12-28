const JSONize = (str) => {
  return str
    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
      return '"' + $1 + '":';
    })
    .replace(/'([^']+)'/g, function (_, $1) {
      return '"' + $1 + '"';
    });
};

module.exports = JSONize;