const apiResponse = require("../utils/apiResponse");

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return apiResponse.error(res, "Usuario no autenticado", null, 401);
  }

  if (req.user.role !== "admin") {
    return apiResponse.error(
      res,
      "No tienes permisos para realizar esta acción",
      null,
      403,
    );
  }

  next();
};

module.exports = isAdmin;
