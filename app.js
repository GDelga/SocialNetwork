// app.js
const DAOPreguntas = require("./js/DAOPreguntas");
const DAOUsuarios = require("./js/DAOUsuarios");
const path = require("path");
const mysql = require("mysql");
const mysqlSession = require("express-mysql-session");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session")
const multer = require("multer");
let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)
const MySQLStore = mysqlSession(session);
const multerFactory = multer({
    dest: path.join(__dirname, "profile_imgs")
})

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
const sessionStore = new MySQLStore(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoPreguntas = new DAOPreguntas(pool);
const daoUsuarios = new DAOUsuarios(pool);

// Se incluye el middleware body-parser en la cadena de middleware
app.use(bodyParser.urlencoded({
    extended: false
}));


const ficheroEstatico = path.join(__dirname, "public");
app.use(express.static(ficheroEstatico));

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/imagenUsuario/:imagen", function (request, response) {
    console.log("hola" + request.params.image);
    console.log(request.params.imagen == "");
    if (request.session.currentUser != undefined) {
        response.status(200);
        response.sendFile(path.join(__dirname, "profile_imgs", "/" + request.params.imagen));
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.get("/imagenUsuario/", function (request, response) {
    if (request.session.currentUser != undefined) {
        response.status(200);
        response.sendFile(path.join(__dirname, "public", "/html/imagenes/NoPerfil.png"))
    } else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.get("/amigos", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.listarPeticiones(request.session.currentUser, function cb_listarPeticiones(err, result) {
            if (err) {
                console.log(err.message);
                response.status(404)
            } else {
                response.status(200)
                let peticiones = result;
                daoUsuarios.listarAmigos(request.session.currentUser, function cb_listarAmigos(err, result) {
                    if (err) {
                        console.log(err.message);
                        response.status(404)
                    } else {
                        response.status(200)
                        let amigos = result;
                        response.render("amigos", {
                            datos: {
                                puntos: request.session.puntos,
                                foto: request.session.foto,
                                peticiones: peticiones,
                                amigos: amigos
                            }
                        });
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

app.get("/registro", function (request, response) {
    response.render("registro", {
        datos: {
            error: false
        }
    });
});

app.post("/registro", multerFactory.single("foto"), function (request, response) {
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
        daoUsuarios.crearUsuario(user, function cb_buscarUsuarios(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                response.status(200);
                request.session.currentUser = user.email;
                response.redirect("/perfil");
            }
        });
    }
});

app.post("/buscar", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.buscarUsuarios(request.session.currentUser, request.body.nombre, function cb_buscarUsuarios(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                response.render("resultadoBusqueda", {
                    datos: {
                        puntos: request.session.puntos,
                        foto: request.session.foto,
                        busqueda: result
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

app.get("/modificar", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                let nacimiento = result[0].NACIMIENTO;
                let fecha = null;
                if (nacimiento) {
                    fecha = nacimiento.getFullYear() + "-" +
                        (nacimiento.getMonth() <= 9 ? "0" + nacimiento.getMonth() : nacimiento.getMonth()) + "-" +
                        (nacimiento.getDate() <= 9 ? "0" + nacimiento.getDate() : nacimiento.getDate())
                }
                response.render("modificar", {
                    datos: {
                        error: false,
                        usuario: result[0],
                        fecha: fecha,
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

app.post("/modificar", function (request, response) {
    if (request.session.currentUser != undefined) {
        console.log(request.body);
        let foto = null,
            errores = false;
        if (request.file) {
            foto = request.file.filename;
        } else foto = request.session.foto;
        if (request.body.fecha == "") {
            request.body.fecha = null;
        }
        if (!/^(.*[^\s]+.*)$/.test(request.body.nombre) && !errores) {
            let user = {
                CORREO: request.session.currentUser,
                GENERO: request.body.genero,
                NOMBRE: request.body.nombre
            }
            response.render("modificar", {
                datos: {
                    error: true,
                    mensaje: "El nombre es obligatorio",
                    usuario: user,
                    fecha: request.body.fecha,
                    puntos: request.session.puntos,
                    foto: request.session.foto
                }
            });
            errores = true;
        }
        if ((request.body.genero != "Masculino" && request.body.genero != "Femenino" &&
                request.body.genero != "Otro") && !errores) {
            let user = {
                CORREO: request.session.currentUser,
                GENERO: request.body.genero,
                NOMBRE: request.body.nombre
            }
            response.render("modificar", {
                datos: {
                    error: true,
                    mensaje: "El género es obligatorio",
                    usuario: user,
                    fecha: request.body.fecha,
                    puntos: request.session.puntos,
                    foto: request.session.foto
                }
            });
            errores = true;
        }
        if (!errores) {
            let user = {
                email: request.session.currentUser,
                nombre: request.body.nombre,
                genero: request.body.genero,
                foto: foto,
                nacimiento: request.body.fecha
            }
            daoUsuarios.modificarUsuario(user, function cb_buscarUsuarios(err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    response.status(200);
                    request.session.foto = user.foto;
                    response.redirect("/perfil");
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


app.get("/perfil", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                let diff = null;
                if (result[0].NACIMIENTO) {
                    diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                    diff /= (60 * 60 * 24);
                    diff = Math.abs(Math.round(diff / 365.25));
                }
                request.session.foto = result[0].FOTO;
                request.session.puntos = result[0].PUNTOS;
                response.render("perfil", {
                    datos: {
                        usuario: result[0],
                        edad: diff,
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

app.get("/solicitar/:correo", function (request, response) {
    daoUsuarios.mandarPeticion(request.session.currentUser, request.params.correo, function cb_mandarPeticion(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/amigos");
    })
})

app.get("/aceptar/:correo", function (request, response) {
    daoUsuarios.aceptarPeticion(request.session.currentUser, request.params.correo, function cb_aceptarPeticion(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/amigos");
    })
})

app.get("/rechazar/:correo", function (request, response) {
    daoUsuarios.rechazarPeticion(request.session.currentUser, request.params.correo, function cb_rechazarPeticion(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/amigos");
    })
})

app.get("/login", function (request, response) {
    response.render("login", {
        datos: {
            correct: true
        }
    });
});

app.post("/login", function (request, response) {

    daoUsuarios.isUserCorrect(request.body.correo,
        request.body.pasw,
        function (error, ok) {
            console.log(error)
            if (error) { // error de acceso a la base de datos
                response.status(500);
                console.log("Erros en la base datos")
            } else if (ok) {
                response.status(200);
                request.session.currentUser = request.body.correo;
                response.redirect("/perfil");
            } else {
                response.status(200);
                response.render("login", {
                    datos: {
                        correct: false,
                        errorMsg: " Usuario y/o contraseña erroneos"
                    }
                });
            }
        });
});

app.get("/logout", function (request, response) {
    if (request.session.currentUser != undefined) {
        request.session.destroy();
    }
    response.render("login", {
        datos: {
            correct: true
        }
    });
});

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
    response.render("login", {
        datos: {
            correct: true
        }
    });
}
function middlewareServerError(error, request, response, next) {
    response.status(500);
    // envío de página 500
    console.log("Error500");
    response.render("login", {
        datos: {
            correct: true
        }
    });
}*/