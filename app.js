// app.js
const routerUsuario = require("./js/Routers/routerUsuario");
const routerPregunta = require("./js/Routers/routerPregunta");
const routerNotificaciones = require("./js/Routers/routerNotificaciones");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

// Crear un servidor Express.js
const app = express();

// Se incluye el middleware body-parser en la cadena de middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use("/usuario", routerUsuario);
app.use("/pregunta", routerPregunta);
app.use("/notificacion", routerNotificaciones);

const ficheroEstatico = path.join(__dirname, "public");
app.use(express.static(ficheroEstatico));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

//manejo errores 404 y 500
app.use(middlewareNotFoundError);
app.use(middlewareServerError);

function middlewareNotFoundError(request, response) {
    response.status(404);
    console.log("Error404");
    response.render("error404");
}

function middlewareServerError(error, request, response, next) {
    response.status(500);
    console.log("Error500");
    response.render("error500");
}