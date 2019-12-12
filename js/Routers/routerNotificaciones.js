// Exportar bibliotecas, exprress app
const express = require("express");
const router = express.Router();
const path = require("path");
const controladorUsuario = require("../Controladores/controladorUsuario");
const controladorNotificaciones = require("../Controladores/controladorNotificaciones");


router.use(controladorUsuario.middlewareSession);
router.use(controladorUsuario.controladorDeAcceso);

router.get("/leido/:id", controladorNotificaciones.getMarcarLeido);
router.get("/leido/", controladorNotificaciones.getMarcarTodas);

module.exports = router;