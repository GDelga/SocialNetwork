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
    store: sessionStore //Para que se guarde en la BDD
});

// Crear una instancia de DAOs
const daoUsuarios = new DAOUsuarios(pool);
const daoNotificaciones = new DAONotificaciones(pool);

function controladorDeAcceso(request, response, next) {
    /*Guardamos los datos del usuario en la variable local
    para poder acceder desde el ejs como usuarioLogueado.algo 
    y mantener la información del usuario siempre actualizada*/
    response.locals.usuarioLogueado = request.session.datosUsuario;
    if (!request.session.currentUser) {
        //Si no se ha iniciado sesión vamos al login
        response.redirect("/usuario/login");
    } else {
        next();
    }
}

//Gestionar petición get de ver registro
function getRegistro(request, response) {
    response.render("registro", {
        datos: {
            error: false
        }
    });
}

//Gestionar petición post de registro
function postRegistro(request, response, next) {
    let foto = null,
        errores = false;
    //Si se ha puesto foto completamos la información con su nombre
    if (request.file) {
        foto = request.file.filename;
    }
    //Si no hay fecha la ponemos a null
    if (request.body.fecha == "") {
        request.body.fecha = null;
    } else {
        let hoy = new Date();
        let miFecha = new Date(request.body.fecha);
        //Comprobamos que nuestra fecha de nacimiento no sea mayor al día actual
        if (hoy < miFecha) {
            response.render("registro", {
                datos: {
                    error: true,
                    mensaje: "La fecha no es válida"
                }
            });
            errores = true;
        }
    }
    //Si el email no es valido
    if (!/^([^@]+@[^@]+\.[a-zA-Z]{2,})$/.test(request.body.correo) && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El email no es válido"
            }
        });
        errores = true;
    }
    //Si la contraseña está vacía
    if (!/^(.*[^\s]+.*)$/.test(request.body.contrasena) && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "La contraseña es obligatoria"
            }
        });
        errores = true;
    }
    //Si el nombre está vacío
    if (!/^(.*[^\s]+.*)$/.test(request.body.nombre) && !errores) {
        response.render("registro", {
            datos: {
                error: true,
                mensaje: "El nombre es obligatorio"
            }
        });
        errores = true;
    }
    //Si no se ha seleccionado género
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
        //Creamos el usuario
        daoUsuarios.crearUsuario(user, function cb_crearUsuario(err, result) {
            if (err) {
                console.log(err.message);
                next(err)
            } else {
                //Iniciamos su sesión en la aplicación
                request.session.currentUser = user.email;
                //Redirigimos al perfil
                response.redirect("/usuario/perfil");
            }
        });
    }
}

//Gestionar la petición get del login
function getLogin(request, response) {
    //Muestra la vista del login
    response.render("login", {
        datos: {
            correct: true
        }
    });
}

//Gestionar petición post del login
function postLogin(request, response, next) {
    //Comprobamos que el usuario y contraseña sean correctos
    daoUsuarios.isUserCorrect(request.body.correo,
        request.body.pasw,
        function (error, ok) {
            if (error) {
                console.log(error.message)
                next(error);
            } else if (ok) {
                //Guardamos el usuario que ha iniciado sesión
                request.session.currentUser = request.body.correo;
                //Redirigimos al perfil
                response.redirect("/usuario/perfil");
            } else {
                //Redirigimos al login
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

//Gestionamos la petición get de logout
function getLogout(request, response) {
    //Si hay un usuario iniciado
    if (request.session.currentUser != undefined) {
        //Cerramos su sesión
        request.session.destroy();
    }
    //Vamos al login
    response.render("login", {
        datos: {
            correct: true
        }
    });
}

//Gestionar petición get de ver perfil
function getPerfil(request, response, next) {
    //Buscamos los datos del usuario
    daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let diff = null;
            if (result[0].NACIMIENTO) {
                //Calculamos la edad
                diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                diff = Math.abs(Math.floor(diff / 365.25));
            }
            //Guardamos los datos del usuario
            request.session.datosUsuario = result[0];
            //Los guardamos también en la variable local
            response.locals.usuarioLogueado = request.session.datosUsuario;
            //Buscamos si el usuario tiene notificaciones
            daoNotificaciones.listarNotificaciones(request.session.currentUser, function cb_listarNotificaciones(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    let notificaciones = result;
                    //Buscamos si ha subido fotos
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

//Gestionar petición get de ver notificaciones
function getNotificaciones(request, response, next) {
    //Buscamos las notificaciones no leidas del usuario actual
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

//Gestionamos la petición get de modificar perfil
function getModificar(request, response, next) {
    //Buscamos los datos del usuario
    daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            let nacimiento = result[0].NACIMIENTO;
            let fecha = "";
            if (nacimiento) {
                //Sacamos la fecha de nacimiento en el formato adecuado
                fecha = nacimiento.getFullYear() + "-" +
                    (nacimiento.getMonth() + 1 <= 9 ? "0" + (nacimiento.getMonth() + 1) : (nacimiento.getMonth() + 1)) + "-" +
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

//Gestionamos la petición post de modificar
function postModificar(request, response, next) {
    let foto = null,
        errores = false;
    //Si hemos puesto foto guardamos los datos
    if (request.file) {
        foto = request.file.filename;
    } else foto = response.locals.usuarioLogueado.FOTO; //Si no hemos cambiado la foto, guardamos la actual
    //Si no se ha puesto fecha la ponemos a null
    if (request.body.fecha == "") {
        request.body.fecha = null;
    } else {
        let hoy = new Date();
        let miFecha = new Date(request.body.fecha);
        //Comprobamos que la fecha sea menor que el día actual
        if (hoy < miFecha) {
            let user = {
                GENERO: request.body.genero,
                NOMBRE: request.body.nombre,
                CORREO: request.body.correo
            }
            response.render("modificar", {
                datos: {
                    error: true,
                    mensaje: "La fecha no es válida",
                    usuario: user,
                    fecha: request.body.fecha
                }
            });
            errores = true;
        }
    }
    //Si el nombre está vacío
    if (!/^(.*[^\s]+.*)$/.test(request.body.nombre) && !errores) {
        let user = {
            GENERO: request.body.genero,
            NOMBRE: request.body.nombre,
            CORREO: request.body.correo
        }
        if (request.body.fecha == null) {
            request.body.fecha = "";
        }
        response.render("modificar", {
            datos: {
                error: true,
                mensaje: "El nombre es obligatorio",
                usuario: user,
                fecha: request.body.fecha
            }
        });
        errores = true;
    }
    //Si no se ha seleccionado género
    if ((request.body.genero != "Masculino" && request.body.genero != "Femenino" &&
            request.body.genero != "Otro") && !errores) {
        let user = {
            GENERO: request.body.genero,
            NOMBRE: request.body.nombre,
            CORREO: request.body.correo
        }
        if (request.body.fecha == null) {
            request.body.fecha = "";
        }
        response.render("modificar", {
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
        //Modificamos el usuario
        daoUsuarios.modificarUsuario(user, function cb_modificarUsuario(err, result) {
            if (err) {
                console.log(err.message);
                next(err);
            } else {
                //Actualizamos su foto
                request.session.datosUsuario.FOTO = user.foto;
                response.redirect("/usuario/perfil");
            }
        });
    }
}

//Carga la imagen del usuario
function getImagenUsuario(request, response) {
    response.sendFile(path.join(__dirname, "..", "..", "profile_imgs", request.params.imagen));
}

//Carga la imagen por defecto del usuario
function getImagenPorDefecto(request, response) {
    response.sendFile(path.join(__dirname, "..", "..", "public", "imagenes/NoPerfil.png"))
}

//Gestiona la petición post de mostrar amigos
function getAmigos(request, response, next) {
    //Buscamos las peticiones
    daoUsuarios.listarPeticiones(request.session.currentUser, function cb_listarPeticiones(err, result) {
        if (err) {
            console.log(err.message);
            next(err)
        } else {
            let peticiones = result;
            //Buscamos nuestros amigos
            daoUsuarios.listarAmigos(request.session.currentUser, function cb_listarAmigos(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err)
                } else {
                    let amigos = result;
                    //Carga la vista con las peticiones y los amigos
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

//Gestiona la petición post de buscar un usuario
function postBuscar(request, response, next) {
    //Buscamos los usuarios que contengan request.body.nombre
    daoUsuarios.buscarUsuarios(request.session.currentUser, request.body.nombre, function cb_buscarUsuarios(err, result) {
        if (err) {
            console.log(err.message);
            next(err);
        } else {
            //Mostramos resultados
            response.render("resultadoBusqueda", {
                datos: {
                    busqueda: result
                }
            });
        }
    });
}

//Gestionar petición get de ver un usuario
function getPerfilUsuario(request, response, next) {
    //Buscamos los datos del usuario
    daoUsuarios.verUsuario(request.params.correo, function cb_verUsuario(err, result) {
        if (err) {
            next(err);
        } else {
            let diff = null;
            if (result[0].NACIMIENTO) {
                //Calculamos su edad
                diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                diff = Math.abs(Math.floor(diff / 365.25));
            }
            let usuario = result[0];
            //Buscamos sus fotos subidas
            daoUsuarios.listarFotos(request.params.correo, function cb_listarFotos(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    //Mostramos la vista del perfil de ese usuario
                    response.render("usuario", {
                        datos: {
                            edad: diff,
                            fotos: result,
                            usuario: usuario,
                            amigo: request.params.amigo
                        }
                    });
                }
            })
        }
    });
}

//Gestionar petición get de enviar una petición de amistad
function getPeticion(request, response, next) {
    //Manda una petición a un usuario
    daoUsuarios.mandarPeticion(request.session.currentUser, request.params.correo, function cb_mandarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err);
        } else response.redirect("/usuario/amigos");
    })
}

//Gestionar petición get de aceptar una petición de amistad
function getAceptar(request, response, next) {
    //Aceptamos la petición de amitad de un usuario
    daoUsuarios.aceptarPeticion(request.session.currentUser, request.params.correo, function cb_aceptarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err)
        } else response.redirect("/usuario/amigos");
    })
}

//Gestionar la petición get de rechazar una petición de amistad
function getRechazar(request, response, next) {
    //Rechazamos la petición de amistad de un usuario
    daoUsuarios.rechazarPeticion(request.session.currentUser, request.params.correo, function cb_rechazarPeticion(err) {
        if (err) {
            console.log(err.message);
            next(err)
        } else response.redirect("/usuario/amigos");
    })
}

//Gestionar petición post de subir una foto cuando tienes 100 puntos
function postSubirFoto(request, response, next) {
    let foto = null,
        errores = false;
    //Si no tengo 100 puntos
    if (request.session.datosUsuario.PUNTOS < 100) {
        errores = true;
        response.redirect("/usuario/perfil");
    }
    //Si hemos añadido foto
    if (request.file) {
        foto = request.file.filename;
    } else {
        errores = true;
        response.redirect("/usuario/perfil");
    }
    //Si no hemos añadido texto a la foto
    if (!/^(.*[^\s]+.*)$/.test(request.body.texto) && !errores) {
        errores = true;
        response.redirect("/usuario/perfil");
    }
    if (!errores) {
        //Insertamos la foto en la BDD
        daoUsuarios.insertarFoto(request.session.currentUser, foto,
            request.body.texto, request.session.datosUsuario.PUNTOS,
            function cb_insertarFoto(err, result) {
                if (err) {
                    console.log(err.message);
                    next(err);
                } else {
                    //Actualizamos la puntuación
                    request.session.datosUsuario.PUNTOS = result;
                    response.redirect("/usuario/perfil");
                }
            });
    }
}

/*IMPORTANTE!!!!!!!!
Exportar cada una de las funciones para que el router tenga acceso a ellas*/
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
    getNotificaciones: getNotificaciones,
    postSubirFoto: postSubirFoto
}