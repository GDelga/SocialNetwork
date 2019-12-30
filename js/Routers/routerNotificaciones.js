// Exportar bibliotecas, exprress app
const express = require("express");
const router = express.Router();
const path = require("path");
const controladorUsuario = require("../Controladores/controladorUsuario");
const controladorNotificaciones = require("../Controladores/controladorNotificaciones");

//Para mantener la sesion del usuario
router.use(controladorUsuario.middlewareSession);
//Para que no se pueda acceder sin iniciar sesión
router.use(controladorUsuario.controladorDeAcceso);

//Manda el id de la pregunta para marcarlo como leido
router.get("/leido/:id", controladorNotificaciones.getMarcarLeido);

//Marca todas las notificaciones como leídas
router.get("/leido/", controladorNotificaciones.getMarcarTodas);

module.exports = router; //Siempre exportar el router para poder tenerlo desde app.js