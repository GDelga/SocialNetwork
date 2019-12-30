class DAONotificaciones {
    constructor(pool) {
        this.pool = pool;
    }

    mandarNotificacion(email, texto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                //Insertamos una notificación nueva como no leida
                connection.query(
                    "INSERT INTO NOTIFICACIONES (ID_USUARIO, VISTO, TEXTO) " +
                    "VALUES (?, ?, ?)",
                    [email, false, texto],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else callback(null);
                    }
                )
            }
        })
    }

    listarNotificaciones(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                //Buscamos todas las querys no leidas del usuario
                connection.query(
                    "SELECT * FROM NOTIFICACIONES WHERE ID_USUARIO=? AND VISTO=?",
                    [email, false],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else callback(null, result);
                    }
                )
            }
        })
    }

    marcarLeida(email, id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                //Actualiza el estado de la notificación a leido
                connection.query(
                    "UPDATE NOTIFICACIONES SET VISTO=? WHERE ID=? AND ID_USUARIO=?",
                    [true, id, email],
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

    marcarTodasLeidas(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                //Actualiza el estado de todas las notificaciones del usuario a leidas
                connection.query(
                    "UPDATE NOTIFICACIONES SET VISTO=? WHERE ID_USUARIO=?",
                    [true, email],
                    function (err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else callback(null);
                    }
                )
            }
        })
    }
}

/*IMPORTANTE!!!!!!!!
Exportar la clase para que el controlador tenga acceso a ella*/
module.exports = DAONotificaciones;