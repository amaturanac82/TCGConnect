const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'logs', 'log.txt');

const ensureLogFile = () => {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '', 'utf-8');
  }
};

const appendVisitLog = (route) => {
  ensureLogFile();

  const now = new Date();
  const date = now.toLocaleDateString('es-CL');
  const time = now.toLocaleTimeString('es-CL');
  const line = `fecha: ${date} | hora: ${time} | ruta: ${route}\n`;

  fs.appendFile(logPath, line, 'utf-8', (error) => {
    if (error) {
      console.error('Error al escribir el log:', error.message);
    }
  });
};

const readVisits = () => {
  ensureLogFile();

  const content = fs.readFileSync(logPath, 'utf-8').trim();
  if (!content) return [];

  return content.split('\n');
};

module.exports = {
  appendVisitLog,
  readVisits
};