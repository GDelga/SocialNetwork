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
app.use(bodyParser.urlencoded({ extended: false }));


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


app.get("/perfil", function (request, response) {
    daoUsuarios.verUsuario(request.session.currentUser, function cb_verUsuario(err, result) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log(result);
            response.render("perfil", { datos: { usuario: result} });
        }
    });

});

app.get("/finish/:taskId", function (request, response) {
    daoT.markTaskDone(request.params.taskId, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        }
        else response.redirect("/task");
    })
})

app.get("/deleteCompleted", function (request, response) {
    daoT.deleteCompleted(user, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        }
        else response.redirect("/task");
    })
})

app.post("/addTask", function (request, response) {
    console.log(request.body)
    task = utilsClass.createTask(request.body.nuevaTarea);
    daoT.insertTask(user, task, function cb_onlyError(err) {
        if (err) {
            console.log(err.message);
        }
        else response.redirect("/task");
    })
})
app.get("/login", function (request, response) {
    response.render("login", {datos: {correct: true}});
});

app.post("/login", function (request, response) {

    daoUsuarios.isUserCorrect(request.body.correo,
        request.body.pasw, function (error, ok) {
            console.log(error)
            if (error) { // error de acceso a la base de datos
                response.status(500);
                console.log("Erros en la base datos")
            }
            else if (ok) {
                request.session.currentUser = request.body.correo;
                response.redirect("/perfil");
            } else {
                response.status(200);
                response.render("login",
                    {datos: { correct:false, errorMsg: " Usuario y/o contraseña erroneos" }});
            }
        });
});

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
