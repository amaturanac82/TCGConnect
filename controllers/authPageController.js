const authPageController = {
  login(req, res) {
    if (res.locals.isAuthenticated) {
      return res.redirect("/auth/profile");
    }

    return res.render("auth/login", {
      titulo: "Iniciar sesión",
    });
  },

  register(req, res) {
    if (res.locals.isAuthenticated) {
      return res.redirect("/auth/profile");
    }

    return res.render("auth/register", {
      titulo: "Crear cuenta",
    });
  },
};

module.exports = authPageController;
