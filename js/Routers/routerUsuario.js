// Exportar bibliotecas, exprress app
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const controladorUsuario = require("../Controladores/controladorUsuario");
const multerFactory = multer({
    dest: path.join(__dirname, "..", "..", "profile_imgs")
})

router.use(controladorUsuario.middlewareSession);

router.get("/registro", controladorUsuario.getRegistro);
router.post("/registro", multerFactory.single("foto"), controladorUsuario.postRegistro);
router.get("/login", controladorUsuario.getLogin);
router.post("/login", controladorUsuario.postLogin);
router.get("/logout", controladorUsuario.getLogout);

router.use(controladorUsuario.controladorDeAcceso);

router.get("/perfil", controladorUsuario.getPerfil);
router.get("/imagenUsuario/:imagen", controladorUsuario.getImagenUsuario);
router.get("/imagenUsuario/", controladorUsuario.getImagenPorDefecto);

router.get("/modificar", controladorUsuario.getModificar);
router.post("/modificar", multerFactory.single("foto"), controladorUsuario.postModificar);

router.get("/amigos", controladorUsuario.getAmigos);
router.post("/buscar", controladorUsuario.postBuscar);
router.get("/verUsuario/:correo/:amigo", controladorUsuario.getPerfilUsuario);

router.get("/solicitar/:correo", controladorUsuario.getPeticion);
router.get("/aceptar/:correo", controladorUsuario.getAceptar);
router.get("/rechazar/:correo", controladorUsuario.getRechazar);
router.get("/notificaciones", controladorUsuario.getNotificaciones);

module.exports = router;