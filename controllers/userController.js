const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Event, Game } = require("../models");
const { generateToken } = require("../utils/jwt");

const COOKIE_NAME = "token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 2,
});

const sanitizeUser = (user) => ({
  id: user.id,
  fullname: user.fullname,
  username: user.username,
  email: user.email,
  role: user.role,
  city: user.city,
  avatar: user.avatar,
});

const userController = {
  async list(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Event,
            as: "organizedEvents",
            include: [{ model: Game, as: "game" }],
          },
        ],
        order: [["username", "ASC"]],
      });

      return res.status(200).json({
        ok: true,
        message: "Usuarios obtenidos correctamente",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener los usuarios",
        error: error.message,
      });
    }
  },

  async detail(req, res) {
    try {
      const { id } = req.params;

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

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Usuario obtenido correctamente",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener el usuario",
        error: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const { fullname, username, email, password, role, city, avatar } = req.body;

      if (!fullname || !username || !email || !password) {
        return res.status(400).json({
          ok: false,
          message: "fullname, username, email y password son obligatorios",
        });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ ok: false, message: "El correo ya está registrado" });
        }
        return res.status(400).json({ ok: false, message: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        role: role || "player",
        city: city || null,
        avatar: avatar || null,
      });

      return res.status(201).json({
        ok: true,
        message: "Usuario creado correctamente",
        data: sanitizeUser(newUser),
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al crear el usuario",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { fullname, username, email, password, role, city } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      if (email || username) {
        const existingUser = await User.findOne({
          where: {
            id: { [Op.ne]: id },
            [Op.or]: [
              email ? { email } : null,
              username ? { username } : null,
            ].filter(Boolean),
          },
        });

        if (existingUser) {
          if (email && existingUser.email === email) {
            return res.status(400).json({ ok: false, message: "El correo ya está registrado" });
          }
          if (username && existingUser.username === username) {
            return res.status(400).json({ ok: false, message: "El nombre de usuario ya está en uso" });
          }
        }
      }

      let updatedPassword = user.password;
      if (password && password.trim() !== "") {
        updatedPassword = await bcrypt.hash(password, 10);
      }

      // ✅ Procesa el archivo si se subió uno nuevo
      const avatarPath = req.file
        ? `/uploads/avatars/${req.file.filename}`
        : (req.body.avatar ?? user.avatar);

      await user.update({
        fullname: fullname ?? user.fullname,
        username: username ?? user.username,
        email: email ?? user.email,
        password: updatedPassword,
        role: role ?? user.role,
        city: city ?? user.city,
        avatar: avatarPath,
      });

      const sanitizedUser = sanitizeUser(user);

      if (req.user && Number(req.user.id) === Number(user.id)) {
        const refreshedToken = generateToken({
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        });
        res.cookie(COOKIE_NAME, refreshedToken, getCookieOptions());
      }

      return res.status(200).json({
        ok: true,
        message: "Usuario actualizado correctamente",
        data: sanitizedUser,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al actualizar el usuario",
        error: error.message,
      });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      await user.destroy();

      return res.status(200).json({
        ok: true,
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar el usuario",
        error: error.message,
      });
    }
  },
};

module.exports = userController;