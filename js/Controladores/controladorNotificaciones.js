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

function getMarcarLeido(request, response, next) {
    daoNotificaciones.marcarLeida(request.session.currentUser, request.params.id, function cb_marcarLeida(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.redirect("/usuario/notificaciones");
        }
    });
}

function getMarcarTodas(request, response, next) {
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

module.exports = {
    getMarcarTodas: getMarcarTodas,
    getMarcarLeido: getMarcarLeido
}