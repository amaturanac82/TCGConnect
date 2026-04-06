const { User, Event, Game } = require("../models");
const { verifyToken } = require("../utils/jwt");

const formatDate = (value) => {
  if (!value) return "Fecha por confirmar";
  return new Date(value).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const normalizeEvent = (event) => {
  const plain = event.toJSON ? event.toJSON() : event;
  return { ...plain, formattedDate: formatDate(plain.eventdate) };
};

const userPageController = {
  async profile(req, res) {
    try {
      const { id } = req.params;

      if (!req.user) {
        const token = req.cookies?.token;
        if (token) {
          try {
            req.user = verifyToken(token);
          } catch (_) {}
        }
      }

      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Event,
            as: "organizedEvents",
            include: [{ model: Game, as: "game" }],
          },
          {
            model: Event,
            as: "savedEvents",
            through: { attributes: [] },
            include: [{ model: Game, as: "game" }],
          },
        ],
      });

      if (!user) return res.status(404).send("Usuario no encontrado");

      const plainUser = user.toJSON();
      const organizedEvents = (plainUser.organizedEvents || []).map(
        normalizeEvent,
      );
      const savedEvents = (plainUser.savedEvents || []).map(normalizeEvent);

      const currentUser = req.user || null;
      const isOwnProfile =
        currentUser &&
        (currentUser.role === "admin" || Number(currentUser.id) === Number(id));

      console.log(
        "isOwnProfile →",
        isOwnProfile,
        "| currentUser →",
        currentUser?.id,
        "| profileId →",
        id,
      );

      return res.render("users/profile", {
        titulo: `Perfil de ${plainUser.username}`,
        isOwnProfile,
        user: {
          ...plainUser,
          organizedEvents,
          savedEvents,
          organizedCount: organizedEvents.length,
          savedCount: savedEvents.length,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al cargar el perfil");
    }
  },
};

module.exports = userPageController;
