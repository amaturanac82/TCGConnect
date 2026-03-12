const { appendVisitLog } = require('../utils/fileManager');

const requestLogger = (req, res, next) => {
  appendVisitLog(req.originalUrl);
  next();
};

module.exports = requestLogger;