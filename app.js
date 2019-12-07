// app.js
const DAOPreguntas = require("./js/DAOPreguntas");
const DAOUsuarios = require("./js/DAOUsuarios");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session")
let configFile = fs.readFileSync("config.json")
let config = JSON.parse(configFile)

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoPreguntas = new DAOPreguntas(pool);
const daoUsuarios = new DAOUsuarios(pool);


var user = "AntMan@gmail.es"

// Se incluye el middleware body-parser en la cadena de middleware
app.use(bodyParser.urlencoded({
    extended: false
}));


const ficheroEstatico = path.join(__dirname, "public");
app.use(express.static(ficheroEstatico));

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false
});
app.use(middlewareSession);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/amigos", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.listarPeticiones(request.session.currentUser, function cb_listarPeticiones(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                let peticiones = result;
                daoUsuarios.listarAmigos(request.session.currentUser, function cb_listarAmigos(err, result) {
                    if (err) {
                        console.log(err.message);
                    } else {
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
    }
    else {
        response.render("login", {
            datos: {
                correct: true
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
    }
    else {
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
                let fecha = nacimiento.getFullYear() + "-" 
                    + (nacimiento.getMonth() <= 9 ? "0" + nacimiento.getMonth() : nacimiento.getMonth()) + "-"
                    + (nacimiento.getDate() <= 9 ? "0" + nacimiento.getDate() : nacimiento.getDate())
                response.render("modificar", {
                    datos: {
                        usuario: result[0],
                        fecha: fecha,
                        puntos: request.session.puntos,
                        foto: request.session.foto
                    }
                });
            }
        });
    }
    else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.post("/modificar", function (request, response) {
    if (request.session.currentUser != undefined) {
        daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                let nacimiento = result[0].NACIMIENTO;
                let fecha = nacimiento.getFullYear() + "-" 
                    + (nacimiento.getMonth() <= 9 ? "0" + nacimiento.getMonth() : nacimiento.getMonth()) + "-"
                    + (nacimiento.getDate() <= 9 ? "0" + nacimiento.getDate() : nacimiento.getDate())
                response.render("perfil", {
                    datos: {
                        usuario: result[0],
                        fecha: fecha,
                        puntos: request.session.puntos,
                        foto: request.session.foto
                    }
                });
            }
        });
    }
    else {
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
                var diff = (new Date().getTime() - result[0].NACIMIENTO.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                diff = Math.abs(Math.round(diff / 365.25));
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
    }
    else {
        response.render("login", {
            datos: {
                correct: true
            }
        });
    }
});

app.get("/finish/:taskId", function (request, response) {
    daoT.markTaskDone(request.params.taskId, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/task");
    })
})

app.get("/deleteCompleted", function (request, response) {
    daoT.deleteCompleted(user, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/task");
    })
})

app.post("/addTask", function (request, response) {
    console.log(request.body)
    task = utilsClass.createTask(request.body.nuevaTarea);
    daoT.insertTask(user, task, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        } else response.redirect("/task");
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

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});