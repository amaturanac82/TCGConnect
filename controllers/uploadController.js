const uploadController = {
  uploadFlyer(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: "No se recibió ningún archivo",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Archivo subido correctamente",
        data: {
          filename: req.file.filename,
          path: `/uploads/events/${req.file.filename}`,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al subir el archivo",
        error: error.message,
      });
    }
  },
};

module.exports = uploadController;