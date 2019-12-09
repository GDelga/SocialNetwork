const path = require("path");
const DAOPreguntas = require("../DAO/DAOPreguntas");
const mysql = require("mysql");
const fs = require("fs");
const session = require("express-session")

let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOs
const daoPreguntas = new DAOPreguntas(pool);

function getPreguntas(request, response, next) {
    daoPreguntas.buscarPreguntas(function cb_buscarPreguntas(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.render("preguntas", {
                datos: {
                    preguntas: result
                }
            });
        }
    });
}

function getCrearPregunta(request, response, next) {
    response.render("crearPregunta", {
        datos: {}
    });
}

function postInsertarRespuestas(request, response, next) {
    let errores = false;
    if (!/^(.*[^\s]+.*)$/.test(request.body.pregunta)) {
        errores = true;
        response.render("crearPregunta", {
            datos: {
                correct: false,
                errorMsg: "La pregunta es obligatoria"
            }
        });
    }
    if (parseInt(request.body.respuestas) <= 0 && !errores) {
        errores = true;
        response.render("crearPregunta", {
            datos: {
                pregunta: request.body.pregunta,
                correct: false,
                errorMsg: "Nº de respuestas no válido"
            }
        });
    }
    if (!errores) {
        response.render("crearPregunta", {
            datos: {
                respuestas: parseInt(request.body.respuestas),
                pregunta: request.body.pregunta,
                correct: true
            }
        });
    }
}

function postCrearPregunta(request, response, next) {
    let errores = false;
    if (!/^(.*[^\s]+.*)$/.test(request.body.pregunta)) {
        errores = true;
        response.render("crearPregunta", {
            datos: {
                respuestas: parseInt(request.body.respuestas),
                correct: false,
                errorMsg: "La pregunta es obligatoria"
            }
        });
    }
    for (let i in request.body.respuesta) {
        if (!/^(.*[^\s]+.*)$/.test(request.body.respuesta[i]) && !errores) {
            errores = true;
            response.render("crearPregunta", {
                datos: {
                    pregunta: request.body.pregunta,
                    respuestas: parseInt(request.body.respuestas),
                    correct: false,
                    errorMsg: "Todas las respuestas tienen que estar rellenadas"
                }
            });
        }
    }
    if (!errores) {
        daoPreguntas.crearPregunta(request.session.currentUser, request.body.pregunta,
            request.body.respuesta,
            function cb_crearPregunta(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    response.redirect("preguntas");
                }
            });
    }
}

function getVerPregunta(request, response, next) {
    daoPreguntas.heRespondido(request.session.currentUser, request.params.id, function cb_verPregunta(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let respondido = false;
            if (result.length == 1) {
                respondido = true;
            }
            daoPreguntas.listarRespuestasAmigos(request.session.currentUser, request.params.id, function cb_verPregunta(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    response.render("verPregunta", {
                        datos: {
                            amigos: result,
                            respondido: respondido,
                            pregunta: request.params.pregunta,
                            id_p: request.params.id
                        }
                    })
                }
            });
        }
    });
}

function getResponderPregunta(request, response, next) {
    daoPreguntas.verPregunta(request.params.id, function cb_verPregunta(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.render("responderPregunta", {
                datos: {
                    pregunta: result
                }
            })
        }
    });
}

function postResponderPregunta(request, response, next) {
    if(request.body.respuesta != undefined) {
        daoPreguntas.responderPregunta(request.session.currentUser, request.body.id, request.body.respuesta, function cb_verPregunta(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                response.redirect("/pregunta/verPregunta/"+request.body.id+"/"+request.body.pregunta)
            }
        });
    }
    else response.redirect("/pregunta/responder/"+request.body.id);
}

function postAddRespuesta(request, response, next) {
    if(/^(.*[^\s]+.*)$/.test(request.body.otro)) {
        daoPreguntas.addRespuesta(request.body.id, request.body.otro, function cb_addRespuesta(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                response.redirect("/pregunta/responder/"+request.body.id);
            }
        });
    }
    else response.redirect("/pregunta/responder/"+request.body.id);
}

function getAdivinarPregunta(request, response, next) {
    daoPreguntas.verPregunta(request.params.pregunta, function cb_verPregunta(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.render("adivinarPregunta", {
                datos: {
                    pregunta: result,
                    amigo: request.params.amigo,
                    nombre: request.params.nombre
                }
            })
        }
    });
}

function postAdivinarPregunta(request, response, next) {
    if(request.body.respuesta != undefined) {
        daoPreguntas.responderAmigo(request.session.currentUser, request.body.id,
             request.body.amigo, request.body.respuesta, response.locals.usuarioLogueado.PUNTOS,
              function cb_verPregunta(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                request.session.datosUsuario.PUNTOS = result;
                response.redirect("/pregunta/verPregunta/"+request.body.id+"/"+request.body.pregunta)
            }
        });
    }
    else response.redirect("/pregunta/adivinar/"+request.body.id+"/"+request.body.amigo+"/"+request.body.nombre);
}

module.exports = {
    getPreguntas: getPreguntas,
    getCrearPregunta: getCrearPregunta,
    postInsertarRespuestas: postInsertarRespuestas,
    postCrearPregunta: postCrearPregunta,
    getVerPregunta: getVerPregunta,
    getResponderPregunta: getResponderPregunta,
    postResponderPregunta: postResponderPregunta,
    postAddRespuesta: postAddRespuesta,
    getAdivinarPregunta: getAdivinarPregunta,
    postAdivinarPregunta: postAdivinarPregunta
}