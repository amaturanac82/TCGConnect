require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const sequelize = require("./config/database");
const { verifyJwt } = require("./utils/jwt");
const hbsHelpers = require("./utils/handlebarsHelpers"); 

const siteRoutes = require("./routes/siteRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const eventRoutes = require("./routes/eventRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
const PORT = process.env.PORT || 3000;

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      ...hbsHelpers,           // ✅ spread del archivo — elimina duplicación
      formatDate: (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("es-CL");
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.currentUser = null;
  res.locals.isAuthenticated = false;
  res.locals.currentPath = req.path;

  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = verifyJwt(token);
      req.user = decoded;
      res.locals.currentUser = decoded;
      res.locals.isAuthenticated = true;
    }
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(requestLogger);

sequelize
  .authenticate()
  .then(() => console.log("Conexión exitosa a PostgreSQL"))
  .catch((error) => console.error("Error de conexión:", error));

app.use("/", siteRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/events", eventRoutes);
app.use("/upload", uploadRoutes);

app.use((req, res) => {
  return res.status(404).render("errors/404", { titulo: "Página no encontrada" });
});

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).render("errors/500", { titulo: "Error del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});