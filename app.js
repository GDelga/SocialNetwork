// app.js
const routerUsuario = require("./js/Routers/routerUsuario");
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
const ficheroEstatico = path.join(__dirname, "public");
app.use(express.static(ficheroEstatico));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Declarar session

// Todo bien

//FIN FUNCIONALIDAD USUARIO

//FUNCIONALIDAD PREGUNTAS

app.get("/crearPregunta", function (request, response) {
    if (request.session.currentUser != undefined) {
        response.render("crearPregunta", {
            datos: {
                puntos: request.session.puntos,
                foto: request.session.foto
            }
        });
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.post("/insertarRespuestas", function (request, response) {
    if (request.session.currentUser != undefined) {
        let errores = false;
        if(!/^(.*[^\s]+.*)$/.test(request.body.pregunta)){
            errores = true;
            response.render("crearPregunta", {
                datos: {
                    puntos: request.session.puntos,
                    foto: request.session.foto,
                    correct: false,
                    errorMsg: "La pregunta es obligatoria"
                }
            });
        }
        if(parseInt(request.body.respuestas) <= 0 && !errores) {
            errores = true;
            response.render("crearPregunta", {
                datos: {
                    pregunta: request.body.pregunta,
                    puntos: request.session.puntos,
                    foto: request.session.foto,
                    correct: false,
                    errorMsg: "Nº de respuestas no válido"
                }
            });
        }
        if(!errores) {
            response.render("crearPregunta", {
                datos: {
                    respuestas: parseInt(request.body.respuestas),
                    pregunta: request.body.pregunta,
                    puntos: request.session.puntos,
                    foto: request.session.foto,
                    correct: true
                }
            });
        }
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.post("/crearPregunta", function (request, response) {
    if (request.session.currentUser != undefined) {
        let errores = false;
        if(!/^(.*[^\s]+.*)$/.test(request.body.pregunta)){
            errores = true;
            response.render("crearPregunta", {
                datos: {
                    respuestas: parseInt(request.body.respuestas),
                    puntos: request.session.puntos,
                    foto: request.session.foto,
                    correct: false,
                    errorMsg: "La pregunta es obligatoria"
                }
            });
        }
        for(let i in request.body.respuesta) {
            if(!/^(.*[^\s]+.*)$/.test(i) && !errores){
                errores = true;
                response.render("crearPregunta", {
                    datos: {
                        pregunta: request.body.pregunta,
                        respuestas: parseInt(request.body.respuestas),
                        puntos: request.session.puntos,
                        foto: request.session.foto,
                        correct: false,
                        errorMsg: "Todas las respuestas tienen que estar rellenadas"
                    }
                });
            }
        }
        if(!errores) {
            daoPreguntas.crearPregunta(request.session.currentUser, request.body.pregunta,
                request.body.respuesta, function cb_buscarPreguntas(err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    response.redirect("preguntas");
                }
            });
        }
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.get("/preguntas", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoPreguntas.buscarPreguntas(request.session.currentUser, function cb_buscarPreguntas(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                response.render("preguntas", {
                    datos: {
                        preguntas: result,
                        puntos: request.session.puntos,
                        foto: request.session.foto
                    }
                });
            }
        });
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

//FIN FUNCIONALIDAD PREGUNTAS

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

/*
//manejo errores 404 y 500
app.use(middlewareNotFoundError);
app.use(middlewareServerError);
// Arranque del servior (listen)
function middlewareNotFoundError(request, response) {
    response.status(404);
    console.log("Error404");
    // Nombre del documento plantilla EJS
    response.render("error404");
}
function middlewareServerError(error, request, response, next) {
    response.status(500);
    // envío de página 500
    console.log("Error500");
    response.render("error500");
}*/