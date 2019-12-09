class DAOPreguntas {
    constructor(pool) {
        this.pool = pool;
    }

    crearPregunta(email, pregunta, respuestas, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO PREGUNTAS (CREADOR, PREGUNTA) " +
                    "VALUES (?, ?)",
                    [email, pregunta],
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

    addRespuesta(pregunta, respuesta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO RESPUESTAS (ID_PREGUNTA, RESPUESTA) " +
                    "VALUES (?, ?)",
                    [pregunta, respuesta],
                    function (err, result) {
                        connection.release();
                        if (err) {                          
                            callback(new Error("Error de acceso a la base de datos"));
                        } else callback(null);
                    }
                )
            }
        })
    }

    verPregunta(pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM PREGUNTAS WHERE ID = ?",
                    [pregunta],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (result.length == 1) {
                                let n_pregunta = result[0];
                                connection.query(
                                    "SELECT * FROM RESPUESTAS WHERE ID_PREGUNTA = ?",
                                    [pregunta],
                                    function (err, result) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, {
                                                respuestas: result,
                                                pregunta: n_pregunta
                                            });
                                        }
                                    }
                                )
                            } else {
                                connection.release();
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                        }
                    }
                )
            }
        })
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

    buscarPreguntas(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT * FROM PREGUNTAS ORDER BY RAND() " +
                    "LIMIT 5",
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

    buscarPreguntasNoRespondidas(email, callback) {
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

    heRespondido(email, pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM RESPONDER WHERE ID_USUARIO=? AND ID_PREGUNTA=?",
                    [email, pregunta],
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

    listarRespuestasAmigos(email, pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT CORREO, NOMBRE, FOTO, RESULTADO FROM USUARIOS AS USER JOIN " +
                    "(SELECT HAN_RESPONDIDO.ID_USUARIO, RESULTADO FROM " +
                    "(SELECT * FROM RESPONDER_AMIGOS WHERE ID_PREGUNTA=?) AS RES_AMIGOS RIGHT OUTER JOIN " +
                    "(SELECT DISTINCT ID_USUARIO FROM RESPONDER AS RES JOIN " +
                    "(SELECT DISTINCT ID_AMIGO FROM AMIGOS WHERE amigos.ID_USUARIO=? AND amigos.ESTADO='ACEPTADO') " +
                    "AS AMI WHERE RES.ID_USUARIO = AMI.ID_AMIGO AND ID_PREGUNTA=?) AS HAN_RESPONDIDO " +
                    "ON RES_AMIGOS.ID_AMIGO = HAN_RESPONDIDO.ID_USUARIO) AS RESULTADO ON USER.CORREO = RESULTADO.ID_USUARIO",
                    [pregunta, email, pregunta],
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

    responderAmigo(email, pregunta, amigo, respuesta, puntos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT ID_RESPUESTA FROM RESPONDER WHERE ID_USUARIO = ? AND ID_PREGUNTA = ?",
                    [amigo, pregunta],
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
                                [email, amigo, pregunta, resultado],
                                function (err, result) {
                                    if (err) {
                                        connection.release();
                                        callback(new Error("Error de acceso a la base de datos"));
                                    } else {
                                        if (resultado == "ACERTADA") {
                                            connection.query(
                                                "UPDATE USUARIOS SET PUNTOS = ? WHERE CORREO = ? ",
                                                [puntos += 50, email],
                                                function (err, result) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(new Error("Error de acceso a la base de datos"));
                                                    } else {
                                                        callback(null, puntos);
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