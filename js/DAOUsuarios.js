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
                                            callback(null);
                                        }
                                    }
                                )
                            } else {
                                callback(null);
                            }
                        }
                    }
                )
            }
        })
    }


}

module.exports = DAOUsuarios;