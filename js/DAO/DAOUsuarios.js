class DAOUsuarios {
    constructor(pool) {
        this.pool = pool;
    }

    crearUsuario(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO USUARIOS (CORREO, CONTRASENA, NOMBRE, GENERO, NACIMIENTO, FOTO) " +
                    "VALUES (?, ?, ?, ?, ?, ?)",
                    [user.email, user.contrasena, user.nombre, user.genero, user.nacimiento, user.foto],
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

    modificarUsuario(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "UPDATE USUARIOS SET NOMBRE=?, GENERO=?, NACIMIENTO=?, FOTO=?" +
                    " WHERE CORREO=?",
                    [user.nombre, user.genero, user.nacimiento, user.foto, user.email],
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

    verUsuario(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM USUARIOS WHERE CORREO=?",
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

    listarPeticiones(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT ID_AMIGO FROM AMIGOS WHERE ID_USUARIO=? AND ESTADO='PETICION'",
                    [email],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (result.length >= 1) {
                                var res = "("
                                for (let i in result) {
                                    res += "\'" + result[i].ID_AMIGO + "\'";
                                    if (i != result.length - 1) res += ",";
                                    else res += ")"
                                }
                                connection.query(
                                    "SELECT CORREO, NOMBRE, FOTO FROM USUARIOS WHERE CORREO IN " + res,
                                    function (err, result) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, result);
                                        }
                                    }
                                )
                            } else {
                                connection.release();
                                callback(null, null);
                            }
                        }
                    }
                )
            }
        })
    }

    listarAmigos(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT ID_AMIGO FROM AMIGOS WHERE ID_USUARIO=? AND ESTADO='ACEPTADO'",
                    [email],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (result.length >= 1) {
                                var res = "("
                                for (let i in result) {
                                    res += "\'" + result[i].ID_AMIGO + "\'";
                                    if (i != result.length - 1) res += ",";
                                    else res += ")"
                                }
                                connection.query(
                                    "SELECT CORREO, NOMBRE, FOTO FROM USUARIOS WHERE CORREO IN " + res,
                                    function (err, result) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, result);
                                        }
                                    }
                                )
                            } else {
                                connection.release();
                                callback(null, null);
                            }
                        }
                    }
                )
            }
        })
    }

    buscarUsuarios(email, nombre, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT CORREO, NOMBRE, FOTO FROM USUARIOS WHERE USUARIOS.CORREO NOT IN" +
                    "(SELECT ID_USUARIO FROM AMIGOS WHERE ID_USUARIO=? OR ID_AMIGO=?)" +
                    "AND USUARIOS.CORREO NOT IN" +
                    "(SELECT ID_AMIGO FROM AMIGOS WHERE ID_USUARIO=? OR ID_AMIGO=?)" +
                    "AND USUARIOS.NOMBRE LIKE \'%" + nombre + "%\' AND CORREO !=?",
                    [email, email, email, email, email],
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

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM USUARIOS WHERE CORREO = ? AND CONTRASENA = ?",
                    [email, password],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), false);
                        } else {
                            console.log(result)
                            if (result.length == 1) {
                                callback(null, true)
                            } else {
                                callback(null, false)
                            }
                        }
                    }
                )
            }
        })
    }

    aceptarPeticion(email, peticion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "UPDATE AMIGOS SET ESTADO=?" +
                    "WHERE ID_USUARIO=? AND ID_AMIGO=?",
                    ["ACEPTADO", email, peticion],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            connection.query(
                                "INSERT INTO AMIGOS (ID_USUARIO, ID_AMIGO, ESTADO) " +
                                "VALUES (?, ?, ?)",
                                [peticion, email, "ACEPTADO"],
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
                    }
                )
            }
        })
    }

    rechazarPeticion(email, peticion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "DELETE FROM AMIGOS" +
                    " WHERE ID_USUARIO =? AND ID_AMIGO=?",
                    [email, peticion],
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

    mandarPeticion(email, peticion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO AMIGOS (ID_USUARIO, ID_AMIGO, ESTADO) " +
                    "VALUES (?, ?, ?)",
                    [peticion, email, "PETICION"],
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

    insertarFoto(email, foto, texto, puntos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "INSERT INTO FOTOS (ID_USUARIO, FOTO, TEXTO) " +
                    "VALUES (?, ?, ?)",
                    [email, foto, texto],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            connection.query(
                                "UPDATE USUARIOS SET PUNTOS=? WHERE CORREO=?",
                                [puntos -= 100, email],
                                function (err, result) {
                                    connection.release();
                                    if (err) {
                                        callback(new Error("Error de acceso a la base de datos"));
                                    } else {
                                        callback(null, puntos);
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    }

    listarFotos(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT * FROM FOTOS WHERE ID_USUARIO=?",
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
}


module.exports = DAOUsuarios;