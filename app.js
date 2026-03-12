const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mainRouter = require('./routes/router');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 | Ruta no encontrada</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <main class="container">
          <h1>404</h1>
          <p>La ruta solicitada no existe.</p>
          <a class="button" href="/">Volver al inicio</a>
        </main>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en http://localhost:${PORT}`);
});