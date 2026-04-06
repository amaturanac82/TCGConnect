const { verifyJwt } = require("../utils/jwt");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token no proporcionado"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Formato de token inválido"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
      error: error.message
    });
  }
};

module.exports = verifyToken;