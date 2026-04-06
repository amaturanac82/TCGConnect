const { Event, Game, User } = require("../models");

const eventController = {
  async list(req, res) {
    try {
      const events = await Event.findAll({
        include: [
          { model: Game, as: "game" },
          {
            model: User,
            as: "organizer",
            attributes: ["id", "fullname", "username", "email", "city"],
          },
        ],
        order: [["eventdate", "ASC"]],
      });

      return res.status(200).json({
        ok: true,
        message: "Eventos obtenidos correctamente",
        data: events,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener los eventos",
        error: error.message,
      });
    }
  },

  async detail(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findByPk(id, {
        include: [
          { model: Game, as: "game" },
          {
            model: User,
            as: "organizer",
            attributes: ["id", "fullname", "username", "email", "city"],
          },
        ],
      });

      if (!event) {
        return res.status(404).json({
          ok: false,
          message: "Evento no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Evento obtenido correctamente",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener el evento",
        error: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const {
        title,
        description,
        format,
        locationname,
        address,
        city,
        eventdate,
        registrationurl,
        isactive,
        gameid,
      } = req.body;

      const flyerPath = req.file
        ? `/uploads/events/${req.file.filename}`
        : null;

      const newEvent = await Event.create({
        title,
        description,
        format,
        locationname,
        address,
        city,
        eventdate,
        registrationurl: registrationurl || null,
        flyer: flyerPath,
        isactive: typeof isactive === "undefined" ? true : isactive,
        gameid,
        organizerid: req.user.id,
      });

      return res.status(201).json({
        ok: true,
        message: "Evento creado correctamente",
        data: newEvent,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al crear el evento",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          ok: false,
          message: "Evento no encontrado",
        });
      }

      const isOwner =
        req.user.role === "admin" ||
        Number(event.organizerid) === Number(req.user.id);

      if (!isOwner) {
        return res.status(403).json({
          ok: false,
          message: "No tienes permisos para editar este evento",
        });
      }

      const allowedFields = [
        "title",
        "description",
        "format",
        "locationname",
        "address",
        "city",
        "eventdate",
        "registrationurl",
        "isactive",
        "gameid",
      ];

      const dataToUpdate = {};

      allowedFields.forEach((field) => {
        if (typeof req.body[field] !== "undefined") {
          dataToUpdate[field] = req.body[field];
        }
      });

      if (req.file) {
        dataToUpdate.flyer = `/uploads/events/${req.file.filename}`;
      }

      await event.update(dataToUpdate);

      return res.status(200).json({
        ok: true,
        message: "Evento actualizado correctamente",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al actualizar el evento",
        error: error.message,
      });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          ok: false,
          message: "Evento no encontrado",
        });
      }

      // Admin puede eliminar cualquier evento
      const isOwner =
        req.user.role === "admin" ||
        Number(event.organizerid) === Number(req.user.id);

      if (!isOwner) {
        return res.status(403).json({
          ok: false,
          message: "No tienes permisos para eliminar este evento",
        });
      }

      await event.destroy();

      return res.status(200).json({
        ok: true,
        message: "Evento eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar el evento",
        error: error.message,
      });
    }
  },
};

module.exports = eventController;
