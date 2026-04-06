const { readVisits } = require("../utils/fileManager");

const home = (req, res) => {
  return res.render("home/index", {
    titulo: "Inicio",
    hero: {
      eyebrow: "TCGConnect",
      heading: "Descubre y organiza eventos de tu comunidad",
      description:
        "Encuentra torneos, actividades y reuniones para tus juegos de cartas favoritos. Publica eventos, conecta con otros jugadores y administra tu perfil en un solo lugar.",
    },
  });
};

const about = (req, res) => {
  return res.render("home/about", {
    titulo: "Acerca de TCGConnect",
  });
};

const status = (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Servidor operativo",
    project: "TCGConnect",
    timestamp: new Date().toISOString(),
  });
};

const visits = (req, res) => {
  const visitsLog = readVisits();

  return res.status(200).json({
    ok: true,
    message: "Acceso registrado correctamente",
    totalRegistros: visitsLog.length,
    data: visitsLog,
  });
};

module.exports = {
  home,
  about,
  status,
  visits,
};
