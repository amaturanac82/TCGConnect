const { Event } = require("../models");

const isEventOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        ok: false,
        message: "Evento no encontrado",
      });
    }

    if (req.user.role === "admin") {
      req.event = event;
      return next();
    }

    if (Number(event.organizer_id) !== Number(req.user.id)) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permisos para modificar este evento",
      });
    }

    req.event = event;
    return next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al validar propietario del evento",
      error: error.message,
    });
  }
};

module.exports = isEventOwner;
