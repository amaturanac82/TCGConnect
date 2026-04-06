const apiResponse = {
  success(res, message = "Operación exitosa", data = null, status = 200) {
    return res.status(status).json({
      ok: true,
      message,
      data
    });
  },

  error(res, message = "Ocurrió un error", error = null, status = 500) {
    return res.status(status).json({
      ok: false,
      message,
      error
    });
  }
};

module.exports = apiResponse;