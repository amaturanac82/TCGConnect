const { verifyJwt } = require("../utils/jwt");
const apiResponse = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers.authorization;

    let token = null;

    if (tokenFromCookie) {
      token = tokenFromCookie;
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return apiResponse.error(res, "Token no proporcionado", null, 401);
    }

    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    return apiResponse.error(
      res,
      "Token inválido o expirado",
      error.message,
      401,
    );
  }
};

module.exports = authMiddleware;
