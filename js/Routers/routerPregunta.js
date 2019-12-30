const express = require("express");
const router = express.Router();
const path = require("path");
const controladorUsuario = require("../Controladores/controladorUsuario");
const controladorPregunta = require("../Controladores/controladorPregunta");

//Para mantener la sesion del usuario
router.use(controladorUsuario.middlewareSession);
//Para que no se pueda acceder sin iniciar sesión
router.use(controladorUsuario.controladorDeAcceso);

//Muestra la vista de preguntas
router.get("/preguntas", controladorPregunta.getPreguntas);

//Muestra la vista de crear pregunta
router.get("/crearPregunta", controladorPregunta.getCrearPregunta);
//Muestra la vista de crear pregunta con los recuadros de respuesta necesarios
router.post("/insertarRespuestas", controladorPregunta.postInsertarRespuestas);
//Crea una nueva pregunta si todos los datos son correctos
router.post("/crearPregunta", controladorPregunta.postCrearPregunta);

/*Nos muestra la información de la pregunta, le pasamos el id y el titulo de la pregunta
 basicamente para no tener que volver a llamar a la BDD, podría no ser necesario*/
router.get("/verPregunta/:id/:pregunta", controladorPregunta.getVerPregunta);

//Muestra la vista para responder a la pregunta indicada
router.get("/responder/:id", controladorPregunta.getResponderPregunta);
//Respondemos a una pregunta
router.post("/responder", controladorPregunta.postResponderPregunta);
//Añadimos una respuesta a una pregunta ya existente
router.post("/addRespuesta", controladorPregunta.postAddRespuesta);
//Nos muestra la vista para responder la pregunta en nombre de un amigo
router.get("/adivinar/:pregunta/:amigo/:nombre", controladorPregunta.getAdivinarPregunta);
//Adivinamos la respuesta de un amigo
router.post("/adivinar", controladorPregunta.postAdivinarPregunta);

module.exports = router; //Siempre exportar el router para poder tenerlo desde app.js