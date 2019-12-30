// Exportar bibliotecas, exprress app
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer"); //Necesario para cargar fotos de perfil
const controladorUsuario = require("../Controladores/controladorUsuario");
//Indicamos el directorio en el que se guardan las fotos de perfil
const multerFactory = multer({
    dest: path.join(__dirname, "..", "..", "profile_imgs")
})

//Para mantener la sesion del usuario
router.use(controladorUsuario.middlewareSession);

//Genera la vista para registrarse
router.get("/registro", controladorUsuario.getRegistro);
//Envia los datos para crear un nuevo usuario, importante poner el multer
router.post("/registro", multerFactory.single("foto"), controladorUsuario.postRegistro);
//Genera la vista del login
router.get("/login", controladorUsuario.getLogin);
//Envia los datos de inicio de sesión, los verifica y te da o no acceso
router.post("/login", controladorUsuario.postLogin);
//Salir de la aplicación
router.get("/logout", controladorUsuario.getLogout);

/*Para que no se pueda acceder sin iniciar sesión, lo colocamos aquí porque
no queremos que se aplique en el login ni el registro*/
router.use(controladorUsuario.controladorDeAcceso);

//Cargar la información del perfil/notificaciones/fotos
router.get("/perfil", controladorUsuario.getPerfil);
//Carga la foto indicada
router.get("/imagenUsuario/:imagen", controladorUsuario.getImagenUsuario);
//Carga la foto por defecto
router.get("/imagenUsuario/", controladorUsuario.getImagenPorDefecto);

//Carga la vista para modificar el perfil
router.get("/modificar", controladorUsuario.getModificar);
//Envía la información del perfil modificado y si es correcta la guarda, importante el multer
router.post("/modificar", multerFactory.single("foto"), controladorUsuario.postModificar);

//Carga la vista de amigos/peticiones
router.get("/amigos", controladorUsuario.getAmigos);
//Carga el resultado de la busqueda de usuarios realizada
router.post("/buscar", controladorUsuario.postBuscar);
//Muestra el perfil de ese usuario (correo) y si amigo es false, nos pondrá un botón para solicitar amistad
router.get("/verUsuario/:correo/:amigo", controladorUsuario.getPerfilUsuario);

//Envía una petición de amistad a un usuario
router.get("/solicitar/:correo", controladorUsuario.getPeticion);
//Aceptar petición de amistad de un usuario
router.get("/aceptar/:correo", controladorUsuario.getAceptar);
//Rechazar petición de amistad de un usuario
router.get("/rechazar/:correo", controladorUsuario.getRechazar);
//Muestra la vista de notificaciones
router.get("/notificaciones", controladorUsuario.getNotificaciones);

//Sube una nueva foto si tienes 100 puntos
router.post("/foto", multerFactory.single("foto"), controladorUsuario.postSubirFoto);

module.exports = router; //Siempre exportar el router para poder tenerlo desde app.js