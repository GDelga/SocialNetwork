class DAOPreguntas {
    constructor(pool) {
        this.pool = pool;
    }

    responderPregunta(email, pregunta, respuesta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO RESPONDER (ID_USUARIO, ID_PREGUNTA, ID_RESPUESTA) " +
                    "VALUES (?, ?, ?)",
                    [email, pregunta, respuesta],
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

    buscarPreguntas(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT * FROM PREGUNTAS WHERE PREGUNTAS.ID NOT IN " +
                    "(SELECT ID_PREGUNTA FROM RESPONDER WHERE ID_USUARIO=?) ORDER BY RAND() " +
                    "LIMIT 5",
                    [email],
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

    listarRespuestasAmigos(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT * FROM RESPONDER AS RES JOIN "+
                    "(SELECT DISTINCT ID_AMIGO FROM AMIGOS WHERE AMIGOS.ID_USUARIO=? " +
                    "AND AMIGOS.ESTADO='ACEPTADO') AS AMI WHERE RES.ID_USUARIO = AMI.ID_AMIGO",
                    [email],
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

    crearPregunta(email, question, respuestas, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO PREGUNTAS (CREADOR, PREGUNTA) " +
                    "VALUES (?, ?)",
                    [email, question],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            let query = "INSERT INTO RESPUESTAS (ID_PREGUNTA, RESPUESTA) VALUES";
                            for (let i in respuestas) {
                                query += "(" + result.insertId + ", '" + respuestas[i] + "')";
                                if (i != respuestas.length - 1) query += ",";
                            }
                            connection.query(
                                query,
                                function (err) {
                                    connection.release();
                                    if (err) {
                                        callback(new Error("Error de acceso a la base de datos"));
                                    } else callback(null);
                                }
                            )
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
                    "SELECT ID_RESPUESTA FROM RESPONDER WHERE ID_USUARIO = ? AND ID_PREGUNTA = ?",
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
                                                [puntos += 50, email],
                                                function (err, result) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(new Error("Error de acceso a la base de datos"));
                                                    } else {
                                                        callback(null, puntos + 50);
                                                    }
                                                }
                                            )
                                        } else {
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