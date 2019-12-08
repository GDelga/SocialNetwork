
class DAOPreguntas {
    constructor(pool) {
        this.pool = pool;
    }

    crearPregunta(question, email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO PREGUNTAS (CREADOR, PREGUNTA) " +
                    "VALUES (?, ?)",
                    [email, question],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null);
                        }
                    }
                )
            }
        })
    }

    verPregunta(question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM PREGUNTAS WHERE ID = ?",
                    [question],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, result);
                        }
                    }
                )
            }
        })
    }

    aceptarPeticion(question, email, peticion, respuesta, puntos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT ID_RESPUESTA FROM RESPONDER WHERE ID_USUARIO = ? AND ID_PREGUNTA = ?"
                    [peticion, question],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            let resultado = "FALLADA";
                            if (result[0].ID_RESPUESTA == respuesta) {
                                resultado = "ACERTADA";
                            }
                            connection.query(
                                "INSERT INTO RESPONDER_AMIGOS (ID_USUARIO, ID_AMIGO, ID_PREGUNTA, RESULTADO) " +
                                "VALUES (?, ?, ?, ?)",
                                [email, peticion, question, resultado],
                                function (err, result) {
                                    if (err) {
                                        connection.release();
                                        callback(new Error("Error de acceso a la base de datos"));
                                    } else {
                                        if (resultado == "ACERTADA") {
                                            connection.query(
                                                "UPDATE USUARIOS SET PUNTOS = ? WHERE CORREO = ?" +
                                                "VALUES (?, ?)",
                                                [puntos+= 50,email],
                                                function (err, result) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(new Error("Error de acceso a la base de datos"));
                                                    } else {
                                                        callback(null, puntos+50);
                                                    }
                                                }
                                            )
                                        }
                                        else {
                                            connection.release();
                                            callback(null, puntos);
                                        }
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    }
}

module.exports = DAOPreguntas;