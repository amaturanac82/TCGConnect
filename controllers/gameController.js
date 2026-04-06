const { Game, Event } = require("../models");

const gameController = {
  async list(req, res) {
    try {
      const games = await Game.findAll({
        include: [{ model: Event, as: "events" }],
        order: [["name", "ASC"]],
      });

      return res.status(200).json({
        ok: true,
        message: "Juegos obtenidos correctamente",
        data: games,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener los juegos",
        error: error.message,
      });
    }
  },

  async detail(req, res) {
    try {
      const { id } = req.params;

      const game = await Game.findByPk(id, {
        include: [{ model: Event, as: "events" }],
      });

      if (!game) {
        return res.status(404).json({
          ok: false,
          message: "Juego no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Juego obtenido correctamente",
        data: game,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener el juego",
        error: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const { name, slug, description, logo } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          ok: false,
          message: "Los campos name y slug son obligatorios",
        });
      }

      const existingGameByName = await Game.findOne({
        where: { name },
      });

      if (existingGameByName) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe un juego con ese nombre",
        });
      }

      const existingGameBySlug = await Game.findOne({
        where: { slug },
      });

      if (existingGameBySlug) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe un juego con ese slug",
        });
      }

      const newGame = await Game.create({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim() || null,
        logo: logo?.trim() || null,
      });

      return res.status(201).json({
        ok: true,
        message: "Juego creado correctamente",
        data: newGame,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al crear el juego",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const game = await Game.findByPk(id);

      if (!game) {
        return res.status(404).json({
          ok: false,
          message: "Juego no encontrado",
        });
      }

      const allowedFields = ["name", "slug", "description", "logo"];
      const dataToUpdate = {};

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          dataToUpdate[field] = req.body[field];
        }
      });

      if (dataToUpdate.name !== undefined) {
        if (!dataToUpdate.name || !dataToUpdate.name.trim()) {
          return res.status(400).json({
            ok: false,
            message: "El campo name no puede estar vacío",
          });
        }

        const existingGameByName = await Game.findOne({
          where: { name: dataToUpdate.name.trim() },
        });

        if (existingGameByName && existingGameByName.id !== game.id) {
          return res.status(400).json({
            ok: false,
            message: "Ya existe un juego con ese nombre",
          });
        }

        dataToUpdate.name = dataToUpdate.name.trim();
      }

      if (dataToUpdate.slug !== undefined) {
        if (!dataToUpdate.slug || !dataToUpdate.slug.trim()) {
          return res.status(400).json({
            ok: false,
            message: "El campo slug no puede estar vacío",
          });
        }

        const normalizedSlug = dataToUpdate.slug.trim().toLowerCase();

        const existingGameBySlug = await Game.findOne({
          where: { slug: normalizedSlug },
        });

        if (existingGameBySlug && existingGameBySlug.id !== game.id) {
          return res.status(400).json({
            ok: false,
            message: "Ya existe un juego con ese slug",
          });
        }

        dataToUpdate.slug = normalizedSlug;
      }

      if (dataToUpdate.description !== undefined) {
        dataToUpdate.description = dataToUpdate.description?.trim() || null;
      }

      if (dataToUpdate.logo !== undefined) {
        dataToUpdate.logo = dataToUpdate.logo?.trim() || null;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({
          ok: false,
          message: "No se enviaron campos válidos para actualizar",
        });
      }

      await game.update(dataToUpdate);

      return res.status(200).json({
        ok: true,
        message: "Juego actualizado correctamente",
        data: game,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al actualizar el juego",
        error: error.message,
      });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const game = await Game.findByPk(id);

      if (!game) {
        return res.status(404).json({
          ok: false,
          message: "Juego no encontrado",
        });
      }

      await game.destroy();

      return res.status(200).json({
        ok: true,
        message: "Juego eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar el juego",
        error: error.message,
      });
    }
  },
};

module.exports = gameController;
