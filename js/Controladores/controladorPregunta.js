const path = require("path");
const DAOPreguntas = require("../DAO/DAOPreguntas");
const DAONotificaciones = require("../DAO/DAONotificaciones");
const mysql = require("mysql");
const fs = require("fs");
const session = require("express-session")

let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOs
const daoPreguntas = new DAOPreguntas(pool);
const daoNotificaciones = new DAONotificaciones(pool);

//Gestionar la petición get de ver las preguntas
function getPreguntas(request, response, next) {
    //Buscamos las preguntas
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

//Gestionamos la petición get para crear pregunta
function getCrearPregunta(request, response, next) {
    //Generamos la vista sin ningún dato sobrr las respuestas
    response.render("crearPregunta", {
        datos: {}
    });
}

//Gestionamos la petición post para crear pregunta añadiendo las respuestas
function postInsertarRespuestas(request, response, next) {
    let errores = false;
    //Si la pregunta está vacía
    if (!/^(.*[^\s]+.*)$/.test(request.body.pregunta)) {
        errores = true;
        response.render("crearPregunta", {
            datos: {
                correct: false,
                errorMsg: "La pregunta es obligatoria"
            }
        });
    }
    //Si no se ha puesto un número de respuestas, para comparar numeros hay que usar parseInt
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
        //Craemos la viste crear pregunta con los campos de texto para las respuestas
        response.render("crearPregunta", {
            datos: {
                respuestas: parseInt(request.body.respuestas),
                pregunta: request.body.pregunta,
                correct: true
            }
        });
    }
}

//Gestionamos la petición post de crear pregunta
function postCrearPregunta(request, response, next) {
    let errores = false;
    //Si etá vacío e titulo de la pregunta
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
    //Para cada respuesta comproamos que no esté vacía
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
        //Creamos la regunta
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

//Gestionar petición get para ver la info de una pregunta
function getVerPregunta(request, response, next) {
    //Consultamos si el usuario actual respondió a la pregunta
    daoPreguntas.heRespondido(request.session.currentUser, request.params.id, function cb_verPregunta(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let respondido = false;
            if (result.length == 1) {
                respondido = true;
            }
            //Consultamos si algún amigo la ha respondido/si hemos adivinado o no alguna respuesta de esos amigos
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

//Gestiona la petición get de responder una pregunta
function getResponderPregunta(request, response, next) {
    //Buscamos los datos de la pregunta
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

//Gestionar la petición post de responder pregunta
function postResponderPregunta(request, response, next) {
    //Si hemos respondido algo
    if (request.body.respuesta != undefined) {
        //Respondemos a la pregunta
        daoPreguntas.responderPregunta(request.session.currentUser, request.body.id, request.body.respuesta, function cb_verPregunta(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                //Redirigimos a la info de la pregunta
                response.redirect("/pregunta/verPregunta/" + request.body.id + "/" + request.body.pregunta)
            }
        });
    } else response.redirect("/pregunta/responder/" + request.body.id); //Redirigimos otra vez a la pregunta
}

//Gestionar la petición post de añadir una respuesta a una pregunta existente
function postAddRespuesta(request, response, next) {
    //Si la respuets no esta vacía
    if (/^(.*[^\s]+.*)$/.test(request.body.otro)) {
        //Intentamos añadir la respuesta
        daoPreguntas.addRespuesta(request.body.id, request.body.otro, function cb_addRespuesta(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                //Redirigimos a responder esa pregunta
                response.redirect("/pregunta/responder/" + request.body.id);
            }
        });
    } else response.redirect("/pregunta/responder/" + request.body.id); //Redirigimos a responder esa pregunta
}

//Gestionar la petición get de adivinar uyna pregunta
function getAdivinarPregunta(request, response, next) {
    //Nos muestra los datos de la pregunta con sus respuestas aleatorias
    daoPreguntas.verAdivinarPregunta(request.params.pregunta, request.params.amigo, function cb_verPregunta(err, result) {
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

//Gestionar la petición post de adivinar pregunta
function postAdivinarPregunta(request, response, next) {
    //Si se ha seleccionado una respuesta
    if (request.body.respuesta != undefined) {
        //Separamos el valor, para obtener por un lado el id de la respuesta y por otro el contenido
        let sep = request.body.respuesta.split("[=]");
        //Adivinamos la respuesta
        daoPreguntas.responderAmigo(request.session.currentUser, request.body.id,
            request.body.amigo, sep[0], response.locals.usuarioLogueado.PUNTOS,
            function cb_verPregunta(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    //Cambiamos la puntuación
                    request.session.datosUsuario.PUNTOS = result.puntos;
                    //Creamos el texto de la notificación
                    let texto = "Tu amig@ " + request.session.datosUsuario.NOMBRE +
                        " ha " + result.resultado + " la pregunta: " +
                        request.body.pregunta + ". Tú respondiste: " + result.respuesta +
                        " y tu amig@: " + sep[1] + ".";
                    //Enviamos la notificación
                    daoNotificaciones.mandarNotificacion(request.body.amigo, texto,
                        function cb_mandarNotificacion(err, result) {
                            if (err) {
                                console.log(err.message);
                                next(err);
                            } else {
                                //Redirigimos a la info de la pregunta
                                response.redirect("/pregunta/verPregunta/" + request.body.id + "/" + request.body.pregunta);
                            }
                        });
                }
            });
    //Redirigimos de nuevo a adivinar la pregunta
    } else response.redirect("/pregunta/adivinar/" + request.body.id + "/" + request.body.amigo + "/" + request.body.nombre);
}

/*IMPORTANTE!!!!!!!!
Exportar cada una de las funciones para que el router tenga acceso a ellas*/
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