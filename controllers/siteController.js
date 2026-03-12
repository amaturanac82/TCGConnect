const path = require('path');
const { readVisits } = require('../utils/fileManager');

const home = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
};

const about = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Acerca del proyecto</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <main class="container">
          <h1>Proyecto Módulo 6</h1>
          <p>Aplicación base construida con Node.js y Express.</p>
          <p>Incluye rutas públicas, archivos estáticos y persistencia simple en archivo plano.</p>
          <a class="button" href="/">Ir al inicio</a>
        </main>
      </body>
    </html>
  `);
};

const status = (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Servidor operativo',
    project: 'Proyecto módulo 6',
    timestamp: new Date().toISOString()
  });
};

const visits = (req, res) => {
  const visitsLog = readVisits();

  res.status(200).json({
    ok: true,
    message: 'Acceso registrado correctamente',
    totalRegistros: visitsLog.length,
    data: visitsLog
  });
};

module.exports = {
  home,
  about,
  status,
  visits
};