const { Op } = require("sequelize");
const { Event, Game, User } = require("../models");

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const buildCalendarGrid = (events) => {
  const eventsByDate = {};
  events.forEach((event) => {
    if (!event.eventdate) return;
    const date = new Date(event.eventdate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push({
      id: event.id,
      title: event.title,
      gameName: event.game?.name || "",
      city: event.city,
    });
  });

  const monthMap = {};
  events.forEach((event) => {
    if (!event.eventdate) return;
    const date = new Date(event.eventdate);
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
    if (!monthMap[key])
      monthMap[key] = { year: date.getFullYear(), month: date.getMonth() };
  });

  return Object.keys(monthMap)
    .sort()
    .map((key) => {
      const { year, month } = monthMap[key];
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      let startDow = firstDay.getDay();
      startDow = startDow === 0 ? 6 : startDow - 1;

      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < startDow; i++) {
        currentWeek.push({ empty: true });
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const dayEvents = eventsByDate[dateStr] || [];
        currentWeek.push({
          empty: false,
          day: d,
          events: dayEvents,
          hasEvents: dayEvents.length > 0,
        });

        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push({ empty: true });
        weeks.push(currentWeek);
      }

      return {
        label: `${MONTHS[month]} ${year}`,
        weeks: weeks.map((week) => ({ days: week })),
      };
    });
};

const eventPageController = {
  async list(req, res) {
    try {
      const { gameid, city } = req.query;

      const where = { isactive: true };
      if (gameid) where.gameid = parseInt(gameid);
      if (city && city.trim()) where.city = { [Op.iLike]: `%${city.trim()}%` };

      const [events, games, cityRows] = await Promise.all([
        Event.findAll({
          where,
          include: [
            {
              model: Game,
              as: "game",
              attributes: ["id", "name", "slug", "logo"],
            },
            { model: User, as: "organizer", attributes: ["id", "username"] },
          ],
          order: [["eventdate", "ASC"]],
        }),
        Game.findAll({ order: [["name", "ASC"]] }),
        Event.findAll({
          where: { isactive: true },
          attributes: ["city"],
          group: ["city"],
          order: [["city", "ASC"]],
        }),
      ]);

      const plainEvents = events.map((e) => e.get({ plain: true }));
      const calendarMonths = buildCalendarGrid(plainEvents);
      const cities = cityRows
        .map((e) => e.get({ plain: true }).city)
        .filter(Boolean);

      return res.render("events/list", {
        titulo: "Eventos",
        games: games.map((g) => g.get({ plain: true })),
        cities,
        filters: {
          gameid: gameid ? parseInt(gameid) : null,
          city: city || "",
        },
        hasFilters: !!(gameid || city),
        hasEvents: plainEvents.length > 0,
        calendarMonths,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al cargar los eventos");
    }
  },

  async createForm(req, res) {
    try {
      const games = await Game.findAll({ order: [["name", "ASC"]] });
      return res.render("events/new", {
        titulo: "Crear evento",
        games: games.map((g) => g.get({ plain: true })),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al cargar el formulario");
    }
  },

  async editForm(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.redirect("/eventos");

      const [event, games] = await Promise.all([
        Event.findByPk(id),
        Game.findAll({ order: [["name", "ASC"]] }),
      ]);

      if (!event) return res.status(404).send("Evento no encontrado");

      const currentUser = req.user;
      const plainEvent = event.get({ plain: true });

      const isOwner =
        currentUser.role === "admin" ||
        Number(currentUser.id) === Number(plainEvent.organizerid);

      if (!isOwner) {
        return res
          .status(403)
          .send("No tienes permisos para editar este evento");
      }

      return res.render("events/edit", {
        titulo: "Editar evento",
        event: plainEvent,
        games: games.map((g) => g.get({ plain: true })),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al cargar el formulario de edición");
    }
  },

  async detail(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.redirect("/eventos");

      const event = await Event.findByPk(id, {
        include: [
          {
            model: Game,
            as: "game",
            attributes: ["id", "name", "slug", "logo"],
          },
          {
            model: User,
            as: "organizer",
            attributes: ["id", "fullname", "username", "city", "avatar"],
          },
        ],
      });

      if (!event) return res.status(404).send("Evento no encontrado");

      const plainEvent = event.get({ plain: true });
      const currentUser = req.user || null;
      const isOwner =
        currentUser &&
        (currentUser.role === "admin" ||
          Number(currentUser.id) === Number(plainEvent.organizer?.id));

      return res.render("events/detail", {
        titulo: plainEvent.title,
        event: plainEvent,
        isOwner,
        isAuthenticated: !!req.user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al cargar el evento");
    }
  },
};

module.exports = eventPageController;
