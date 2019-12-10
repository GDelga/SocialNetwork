const path = require("path");
const DAOUsuarios = require("../DAO/DAOUsuarios");
const DAONotificaciones = require("../DAO/DAONotificaciones");
const mysql = require("mysql");
const mysqlSession = require("express-mysql-session");
const fs = require("fs");
const session = require("express-session")
const MySQLStore = mysqlSession(session);


let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

const pool = mysql.createPool(config.mysqlConfig);

const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

// Crear una instancia de DAOs
const daoUsuarios = new DAOUsuarios(pool);
const daoNotificaciones = new DAONotificaciones(pool);

function controladorDeAcceso(request, response, next) {
    response.locals.usuarioLogueado = request.session.datosUsuario;
    if (!request.session.currentUser) {
        response.redirect("/usuario/login");
    } else {
        next();
    }
}

function getRegistro(request, response) {
    response.render("registro", {
        datos: {
            error: false
        }
    });
}

function postRegistro(request, response, next) {
    let foto = null,
        errores = false;
    if (request.file) {
        foto = request.file.filename;
    }
    if (request.body.fecha == "") {
        request.body.fecha = null;
    }
    if (!/^([^@]+@[^@]+\.[a-zA-Z]{2,})$/.test(request.body.correo)) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El email no es válido"
            }
        });
        errores = true;
    }
    if (!/^(.*[^\s]+.*)$/.test(request.body.contrasena) && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "La contraseña es obligatoria"
            }
        });
        errores = true;
    }
    if (!/^(.*[^\s]+.*)$/.test(request.body.nombre) && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El nombre es obligatorio"
            }
        });
        errores = true;
    }
    if ((request.body.genero != "Masculino" && request.body.genero != "Femenino" &&
            request.body.genero != "Otro") && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El género es obligatorio"
            }
        });
        errores = true;
    }
    if (!errores) {
        let user = {
            email: request.body.correo,
            nombre: request.body.nombre,
            contrasena: request.body.contrasena,
            genero: request.body.genero,
            foto: foto,
            nacimiento: request.body.fecha
        }
        daoUsuarios.crearUsuario(user, function cb_crearUsuario(err, result) {
            if (err) {
                console.log(err.message);
                next(err)
            } else {
                request.session.currentUser = user.email;
                response.redirect("/perfil");
            }
        });
    }
}

function getLogin(request, response) {
    response.render("login", {
        datos: {
            correct: true
        }
    });
}

function postLogin(request, response, next) {
    daoUsuarios.isUserCorrect(request.body.correo,
        request.body.pasw,
        function (error, ok) {
            if (error) {
                console.log(error.message)
                next(error);
            } else if (ok) {
                request.session.currentUser = request.body.correo;
                response.redirect("/usuario/perfil");
            } else {
                response.render("login", {
                    datos: {
                        correct: false,
                        errorMsg: "Usuario y/o contraseña erroneos"
                    }
                });
            }

        }
    );
}

function getLogout(request, response) {
    if (request.session.currentUser != undefined) {
        request.session.destroy();
    }
    response.render("login", {
        datos: {
            correct: true
        }
    });
}

function getPerfil(request, response, next) {
    daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let diff = null;
            if (result[0].NACIMIENTO) {
                diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                diff = Math.abs(Math.floor(diff / 365.25));
            }
            request.session.datosUsuario = result[0];
            response.locals.usuarioLogueado = request.session.datosUsuario;
            daoNotificaciones.listarNotificaciones(request.session.currentUser, function cb_listarNotificaciones(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    let notificaciones = result;
                    daoUsuarios.listarFotos(request.session.currentUser, function cb_listarFotos(err, result) {
                        if (err) {
                            console.log(err.message);
                            next(err);
                        } else {
                            response.render("perfil", {
                                datos: {
                                    edad: diff,
                                    notificaciones: notificaciones,
                                    fotos: result
                                }
                            });
                        }
                    })
                }
            })
        }
    });
}

function getNotificaciones(request, response, next) {
    daoNotificaciones.listarNotificaciones(request.session.currentUser, function cb_listarNotificaciones(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.render("notificaciones", {
                datos: {
                    notificaciones: result
                }
            });
        }
    })
}

function getModificar(request, response, next) {
    daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let nacimiento = result[0].NACIMIENTO;
            let fecha = "";
            if (nacimiento) {
                fecha = nacimiento.getFullYear() + "-" +
                    (nacimiento.getMonth() + 1 <= 9 ? "0" + (nacimiento.getMonth() + 1) : (nacimiento.getMonth() +1)) + "-" +
                    (nacimiento.getDate() <= 9 ? "0" + nacimiento.getDate() : nacimiento.getDate());
            }
            response.render("modificar", {
                datos: {
                    error: false,
                    usuario: result[0],
                    fecha: fecha
                }
            });
        }
    });
}

function postModificar(request, response, next) {
    let foto = null,
        errores = false;
    if (request.file) {
        foto = request.file.filename;
    } else foto = response.locals.usuarioLogueado.FOTO;
    if (request.body.fecha == "") {
        request.body.fecha = null;
    }
    if (!/^(.*[^\s]+.*)$/.test(request.body.nombre)) {
        let user = {
            GENERO: request.body.genero,
            NOMBRE: request.body.NOMBRE,
            CORREO: request.body.email
        }
        if (request.body.fecha == null) {
            request.body.fecha = "";
        }
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El nombre es obligatorio",
                usuario: user,
                fecha: request.body.fecha
            }
        });
        errores = true;
    }
    if ((request.body.genero != "Masculino" && request.body.genero != "Femenino" &&
            request.body.genero != "Otro") && !errores) {
        let user = {
            GENERO: request.body.genero,
            NOMBRE: request.body.NOMBRE,
            CORREO: request.body.email
        }
        if (request.body.fecha == null) {
            request.body.fecha = "";
        }
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El genero es obligatorio",
                usuario: user,
                fecha: request.body.fecha
            }
        });
        errores = true;
    }
    if (!errores) {
        let user = {
            email: request.body.correo,
            nombre: request.body.nombre,
            genero: request.body.genero,
            foto: foto,
            nacimiento: request.body.fecha
        }
        daoUsuarios.modificarUsuario(user, function cb_modificarUsuario(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                request.session.datosUsuario.FOTO = user.foto;
                response.redirect("/usuario/perfil");
            }
        });
    }
}

function getImagenUsuario(request, response) {
    response.sendFile(path.join(__dirname, "..", "..", "profile_imgs", request.params.imagen));
}

function getImagenPorDefecto(request, response) {
    response.sendFile(path.join(__dirname, "..", "..", "public", "imagenes/NoPerfil.png"))
}

function getAmigos(request, response, next) {
    daoUsuarios.listarPeticiones(request.session.currentUser, function cb_listarPeticiones(err, result) {
        if (err) {
            console.log(err.message);
            next(err)
        } else {
            let peticiones = result;
            daoUsuarios.listarAmigos(request.session.currentUser, function cb_listarAmigos(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err)
                } else {
                    let amigos = result;
                    response.render("amigos", {
                        datos: {
                            peticiones: peticiones,
                            amigos: amigos
                        }
                    });
                }
            });
        }
    });
}

function postBuscar(request, response, next) {
    daoUsuarios.buscarUsuarios(request.session.currentUser, request.body.nombre, function cb_buscarUsuarios(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            response.render("resultadoBusqueda", {
                datos: {
                    busqueda: result
                }
            });
        }
    });
}

function getPerfilUsuario(request, response, next) {
    daoUsuarios.verUsuario(request.params.correo, function cb_verUsuario(err, result) {
        if (err) {
            next(err);
        } else {
            let diff = null;
            if (result[0].NACIMIENTO) {
                diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                diff = Math.abs(Math.round(diff / 365.25));
            }
            response.render("usuario", {
                datos: {
                    usuario: result[0],
                    edad: diff,
                    amigo: request.params.amigo
                }
            });
        }
    });
}

function getPeticion(request, response, next) {
    daoUsuarios.mandarPeticion(request.session.currentUser, request.params.correo, function cb_mandarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err);
        } else response.redirect("/usuario/amigos");
    })
}

function getAceptar(request, response, next) {
    daoUsuarios.aceptarPeticion(request.session.currentUser, request.params.correo, function cb_aceptarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err)
        } else response.redirect("/usuario/amigos");
    })
}

function getRechazar(request, response, next) {
    daoUsuarios.rechazarPeticion(request.session.currentUser, request.params.correo, function cb_rechazarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err)
        } else response.redirect("/usuario/amigos");
    })
}



module.exports = {
    controladorDeAcceso: controladorDeAcceso,
    getRegistro: getRegistro,
    postRegistro: postRegistro,
    getLogin: getLogin,
    postLogin: postLogin,
    getLogout: getLogout,
    getPerfil: getPerfil,
    getModificar: getModificar,
    postModificar: postModificar,
    getPerfilUsuario: getPerfilUsuario,
    getAmigos: getAmigos,
    postBuscar: postBuscar,
    getPeticion: getPeticion,
    getAceptar: getAceptar,
    getRechazar: getRechazar, 
    getImagenPorDefecto: getImagenPorDefecto,
    getImagenUsuario: getImagenUsuario,
    middlewareSession: middlewareSession,
    getNotificaciones: getNotificaciones
}