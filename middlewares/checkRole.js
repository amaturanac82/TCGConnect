const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no autenticado",
      });
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};

module.exports = checkRole;
