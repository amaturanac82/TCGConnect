const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const apiResponse = require("../utils/apiResponse");

const COOKIE_NAME = "token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 2,
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

const authController = {
  async register(req, res) {
    try {
      const { fullname, username, email, password, city } = req.body;

      if (!fullname || !username || !email || !password) {
        return apiResponse.error(
          res,
          "fullname, username, email y password son obligatorios",
          null,
          400
        );
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return apiResponse.error(res, "El correo o username ya está registrado", null, 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        role: "player",
        city: city || null,
        avatar: null,
      });

      return apiResponse.success(
        res,
        "Usuario registrado correctamente",
        {
          id: newUser.id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          city: newUser.city,
          avatar: newUser.avatar,
        },
        201
      );
    } catch (error) {
      return apiResponse.error(res, "Error al registrar el usuario", error.message, 500);
    }
  },

  async login(req, res) {
    try {
      const { email, username, password } = req.body;

      if ((!email && !username) || !password) {
        return apiResponse.error(
          res,
          "Debes enviar email o username, y password",
          null,
          400
        );
      }

      const user = await User.findOne({
        where: email ? { email } : { username },
      });

      if (!user) {
        return apiResponse.error(res, "Credenciales inválidas", null, 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return apiResponse.error(res, "Credenciales inválidas", null, 401);
      }

      const token = generateToken({
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });

      res.cookie(COOKIE_NAME, token, getCookieOptions());

      return res.status(200).json({
        ok: true,
        message: "Login exitoso",
        redirect: "/auth/profile",
        data: {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      return apiResponse.error(res, "Error al iniciar sesión", error.message, 500);
    }
  },

  async profilePage(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        res.clearCookie(COOKIE_NAME, clearCookieOptions());
        return res.redirect("/auth/login");
      }

      return res.render("auth/profile", {
        titulo: "Mi perfil",
        user: user.get({ plain: true }),
      });
    } catch (error) {
      return res.status(500).render("auth/login", {
        titulo: "Iniciar sesión",
        error: "No se pudo cargar el perfil",
      });
    }
  },

  async me(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return apiResponse.error(res, "Usuario no encontrado", null, 404);
      }

      return apiResponse.success(res, "Perfil obtenido correctamente", user, 200);
    } catch (error) {
      return apiResponse.error(res, "Error al obtener el perfil", error.message, 500);
    }
  },

  logout(req, res) {
    res.clearCookie(COOKIE_NAME, clearCookieOptions());

    const wantsHtml = req.headers.accept && req.headers.accept.includes("text/html");

    if (wantsHtml) {
      return res.redirect("/auth/login");
    }

    return res.status(200).json({
      ok: true,
      message: "Sesión cerrada correctamente",
    });
  },
};

module.exports = authController;