const { User, Event } = require("../models");

const savedEventController = {
  async toggle(req, res) {
    try {
      const userId  = req.user.id;
      const eventId = parseInt(req.params.eventId);

      if (isNaN(eventId)) return res.status(400).json({ ok: false, message: "ID inválido" });

      const [user, event] = await Promise.all([
        User.findByPk(userId),
        Event.findByPk(eventId),
      ]);

      if (!user || !event) {
        return res.status(404).json({ ok: false, message: "Usuario o evento no encontrado" });
      }

      const saved = await user.getSavedEvents({ where: { id: eventId } });

      if (saved.length > 0) {
        await user.removeSavedEvents(eventId);
        return res.json({ ok: true, saved: false, message: "Evento eliminado de favoritos" });
      } else {
        await user.addSavedEvents(eventId);
        return res.json({ ok: true, saved: true, message: "Evento guardado en favoritos" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: "Error al actualizar favoritos", error: error.message });
    }
  },

  async list(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      const savedEvents = await user.getSavedEvents();
      const ids = savedEvents.map((e) => e.id);
      return res.json({ ok: true, data: ids });
    } catch (error) {
      return res.status(500).json({ ok: false, message: "Error", error: error.message });
    }
  },
};

module.exports = savedEventController;