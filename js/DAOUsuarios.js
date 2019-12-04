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
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            connection.release();
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
                    "INSERT USUARIOS SET CONTRASENA=?, NOMBRE=?, GENERO=?, NACIMIENTO=?, FOTO=?" +
                    "WHERE CORREO=?",
                    [user.contrasena, user.nombre, user.genero, user.nacimiento, user.foto, user.email],
                    function (err, result) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            connection.release();
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
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            connection.release();
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
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (result.length >= 1) {
                                var res = "("
                                for (let i in result) {
                                    res += result[i].ID_AMIGO;
                                    if (i != result.length - 1) res += ",";
                                    else res += ")"
                                }
                                connection.query(
                                    "SELECT NOMBRE, FOTO FROM USUARIOS WHERE ID IN " + res,
                                    function (err) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, result);
                                        }
                                    }
                                )
                            } else {
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
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (result.length >= 1) {
                                var res = "("
                                for (let i in result) {
                                    res += result[i].ID_AMIGO;
                                    if (i != result.length - 1) res += ",";
                                    else res += ")"
                                }
                                connection.query(
                                    "SELECT NOMBRE, FOTO FROM USUARIOS WHERE ID IN " + res,
                                    function (err) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, result);
                                        }
                                    }
                                )
                            } else {
                                callback(null, null);
                            }
                        }
                    }
                )
            }
        })
    }

    buscarUsuarios(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                connection.query(
                    "SELECT DISTINCT NOMBRE, FOTO FROM USUARIOS WHERE USUARIOS.CORREO NOT IN" +
                    "(SELECT ID_USUARIO FROM AMIGOS WHERE ID_USUARIO=? OR ID_AMIGO=?)" +
                    "AND USUARIOS.CORREO NOT IN" +
                    "(SELECT ID_AMIGO FROM AMIGOS WHERE ID_USUARIO=? OR ID_AMIGO=?)" +
                    "AND USUARIOS.NOMBRE LIKE '%e%'",
                    [email, email, email, email],
                    function (err, result) {
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
}


module.exports = DAOUsuarios;