module.exports = {
  eq: (a, b) => a === b,
  startsWith: (value, prefix) => {
    if (typeof value !== "string") return false;
    return value.startsWith(prefix);
  }
};