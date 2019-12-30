const path = require("path");
const DAONotificaciones = require("../DAO/DAONotificaciones");
const mysql = require("mysql");
const fs = require("fs");
const session = require("express-session")

let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOs
const daoNotificaciones = new DAONotificaciones(pool);

//Gestionar la petición get de marcar como leido
function getMarcarLeido(request, response, next) {
    //Intentamos marcar como leido del usuario actual request.session.currentUser
    //la notificación request.params.id
    daoNotificaciones.marcarLeida(request.session.currentUser, request.params.id, function cb_marcarLeida(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.redirect("/usuario/notificaciones");
        }
    });
}

//Gestionar la petición get de marcar todas las notificaciones como leidas
function getMarcarTodas(request, response, next) {
    //Intentamos marcar todas como leido
    daoNotificaciones.marcarTodasLeidas(request.session.currentUser,
        function cb_marcarLeida(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.redirect("/usuario/notificaciones");
        }
    });
}

/*IMPORTANTE!!!!!!!!
Exportar cada una de las funciones para que el router tenga acceso a ellas*/
module.exports = {
    getMarcarTodas: getMarcarTodas,
    getMarcarLeido: getMarcarLeido
}