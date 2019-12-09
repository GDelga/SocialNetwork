const express = require("express");
const router = express.Router();
const path = require("path");
const controladorUsuario = require("../Controladores/controladorUsuario");
const controladorPregunta = require("../Controladores/controladorPregunta");

router.use(controladorUsuario.middlewareSession);
router.use(controladorUsuario.controladorDeAcceso);

router.get("/preguntas", controladorPregunta.getPreguntas);

router.get("/crearPregunta", controladorPregunta.getCrearPregunta);
router.post("/insertarRespuestas", controladorPregunta.postInsertarRespuestas);
router.post("/crearPregunta", controladorPregunta.postCrearPregunta);

router.get("/verPregunta/:id/:pregunta", controladorPregunta.getVerPregunta);

router.get("/responder/:id", controladorPregunta.getResponderPregunta);
router.post("/responder/:id/:pregunta", controladorPregunta.postResponderPregunta);
router.post("/addRespuesta/:id", controladorPregunta.postAddRespuesta);
router.get("/adivinar/:pregunta/:amigo/:nombre", controladorPregunta.getAdivinarPregunta);
router.post("/adivinar", controladorPregunta.postAdivinarPregunta);

module.exports = router;