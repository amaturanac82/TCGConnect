const apiResponse = require("../utils/apiResponse");

const isSelfOrAdmin = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return apiResponse.error(res, "Usuario no autenticado", null, 401);
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (Number(req.user.id) !== Number(id)) {
      return apiResponse.error(
        res,
        "No tienes permisos para realizar esta acción",
        null,
        403
      );
    }

    return next();
  } catch (error) {
    return apiResponse.error(
      res,
      "Error al validar permisos del usuario",
      error.message,
      500
    );
  }
};

module.exports = isSelfOrAdmin;