# TCGConnect

TCGConnect es una plataforma comunitaria para publicar, explorar y guardar eventos de juegos de cartas coleccionables como torneos, ligas, drafts y más.

La idea del proyecto es centralizar eventos que normalmente están dispersos en grupos de WhatsApp, Instagram o Discord, permitiendo que tiendas, organizadores y jugadores encuentren todo en un solo lugar.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Creación, edición y eliminación de eventos.
- Vista de detalle para cada evento.
- Guardado de eventos favoritos.
- Exploración de eventos publicados por la comunidad.
- Diseño responsive para desktop y móvil.

## Tecnologías usadas

- Node.js
- Express
- Handlebars
- PostgreSQL
- Sequelize
- HTML
- CSS
- JavaScript

## Requisitos

Antes de ejecutar el proyecto, necesitas tener instalado:

- Node.js
- npm
- PostgreSQL

## Instalación

1. Clona el repositorio:

```bash
git clone URL-DEL-REPOSITORIO
cd NOMBRE-DEL-PROYECTO
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea tu archivo `.env` en la raíz del proyecto con las variables necesarias.

## Variables de entorno

Ejemplo de archivo `.env`:

```env
PORT=3000
DB_NAME=ddbb_tcgconnect
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=tu_secreto
```

> Ajusta estas variables según tu configuración local.

## Ejecución del proyecto

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

Si tu proyecto no usa `dev`, puedes ejecutar directamente:

```bash
node app.js
```

o el archivo principal que corresponda.

## Estructura general del proyecto

```bash
.
├── controllers
├── middlewares
├── models
├── routes
├── views
├── public
├── config
├── app.js
└── package.json
```

## Rutas principales

- `/` — Página principal.
- `/events` o `/eventos` — Listado de eventos.
- `/events/new` o `/eventos/new` — Crear evento.
- `/events/:id` o `/eventos/:id` — Ver detalle del evento.
- `/login` — Iniciar sesión.
- `/register` — Registrarse.

## Uso

1. Inicia sesión o regístrate.
2. Crea un evento con su información y flyer.
3. Explora los eventos publicados.
4. Guarda los eventos que te interesen.
5. Edita o elimina tus propios eventos cuando lo necesites.

## Notas

- El proyecto está orientado a la comunidad de TCG.
- La información de cada evento puede incluir juego, ciudad, fecha, descripción, capacidad, precio y flyer.
- Los usuarios autenticados pueden guardar eventos favoritos.

## Autor

Andres Maturana

## Licencia

Proyecto académico / personal.  