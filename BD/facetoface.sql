-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-12-2019 a las 19:25:34
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facetoface`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_AMIGO` varchar(255) NOT NULL COMMENT 'id del amigo que manda la peticion',
  `ESTADO` enum('ACEPTADO','PETICION') NOT NULL COMMENT 'estado de la peticion'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `ID` int(11) NOT NULL,
  `ID_USUARIO` varchar(255) NOT NULL,
  `FOTO` varchar(255) NOT NULL,
  `TEXTO` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `ID` int(11) NOT NULL COMMENT 'id de la notificacion',
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `TEXTO` varchar(255) NOT NULL COMMENT 'contenido de la notificacion',
  `VISTO` tinyint(1) NOT NULL COMMENT 'estado de la notificación'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `ID` int(4) NOT NULL COMMENT 'id de la pregunta',
  `CREADOR` varchar(255) NOT NULL COMMENT 'id del usuario que ha creado la pregunta',
  `PREGUNTA` varchar(255) NOT NULL COMMENT 'texto de la pregunta'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`ID`, `CREADOR`, `PREGUNTA`) VALUES
(1, 'gdelga02@ucm.es', '¿PS4, XBox One o Nintendo Switch?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responder`
--

CREATE TABLE `responder` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta',
  `ID_RESPUESTA` int(4) NOT NULL COMMENT 'respuesta dada'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responder_amigos`
--

CREATE TABLE `responder_amigos` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_AMIGO` varchar(255) NOT NULL COMMENT 'id del amigo que ya ha respondido',
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta a adivinar',
  `RESULTADO` enum('ACERTADA','FALLADA') NOT NULL COMMENT 'indica si has acertado o no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `ID` int(4) NOT NULL COMMENT 'id de la respuesta',
  `RESPUESTA` varchar(255) NOT NULL COMMENT 'respuesta',
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta',
  `ORIGINAL` tinyint(1) NOT NULL COMMENT 'indica si la respuesta la ha anadido otra persona'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`ID`, `RESPUESTA`, `ID_PREGUNTA`, `ORIGINAL`) VALUES
(1, 'PS4', 1, 1),
(2, 'XBox One', 1, 1),
(3, 'Nintendo Switch', 1, 1),
(4, 'Ninguna', 1, 1),
(5, 'Todas', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `CORREO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `CONTRASENA` varchar(255) NOT NULL COMMENT 'contrasena',
  `NOMBRE` varchar(255) NOT NULL COMMENT 'nombre completo',
  `GENERO` enum('Masculino','Femenino','Otro') NOT NULL COMMENT 'genero del usuario',
  `NACIMIENTO` date DEFAULT NULL COMMENT 'fecha de nacimiento',
  `FOTO` varchar(255) DEFAULT NULL COMMENT 'foto de perfil',
  `PUNTOS` int(4) NOT NULL DEFAULT '0' COMMENT 'puntuacion del usuario'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`CORREO`, `CONTRASENA`, `NOMBRE`, `GENERO`, `NACIMIENTO`, `FOTO`, `PUNTOS`) VALUES
('gdelga02@ucm.es', 'Secreto', 'Guillermo Delgado', 'Masculino', '1997-01-25', '41b25181cf78faf053c5581bce7f40be', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`ID_USUARIO`,`ID_AMIGO`),
  ADD KEY `FOREIGNKEY_AMIGO_ID_AMIGO` (`ID_AMIGO`);

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FOREIGNKEY_FOTOS_ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FOREIGNKEY_PREGUNTA_CREADOR` (`CREADOR`);

--
-- Indices de la tabla `responder`
--
ALTER TABLE `responder`
  ADD PRIMARY KEY (`ID_USUARIO`,`ID_PREGUNTA`),
  ADD KEY `FOREIGNKEY_RESPONDER_ID_PREGUNTA` (`ID_PREGUNTA`),
  ADD KEY `FOREIGNKEY_RESPONDER_ID_RESPUESTA` (`ID_RESPUESTA`);

--
-- Indices de la tabla `responder_amigos`
--
ALTER TABLE `responder_amigos`
  ADD PRIMARY KEY (`ID_USUARIO`,`ID_AMIGO`,`ID_PREGUNTA`) USING BTREE,
  ADD KEY `FOREIGNKEY_RESPONDER_AMIGO_ID_AMIGO` (`ID_AMIGO`),
  ADD KEY `FOREIGNKEY_RESPONDER_AMIGO_ID_PREGUNTA` (`ID_PREGUNTA`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FOREIGNKEY_RESPUESTAS_ID_PREGUNTA` (`ID_PREGUNTA`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`CORREO`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id de la notificacion', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la pregunta', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la respuesta', AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `FOREIGNKEY_AMIGO_ID_AMIGO` FOREIGN KEY (`ID_AMIGO`) REFERENCES `usuarios` (`CORREO`),
  ADD CONSTRAINT `FOREIGNKEY_AMIGO_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD CONSTRAINT `FOREIGNKEY_FOTOS_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `FOREIGNKEY_PREGUNTA_CREADOR` FOREIGN KEY (`CREADOR`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `responder`
--
ALTER TABLE `responder`
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_ID_PREGUNTA` FOREIGN KEY (`ID_PREGUNTA`) REFERENCES `preguntas` (`ID`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_ID_RESPUESTA` FOREIGN KEY (`ID_RESPUESTA`) REFERENCES `respuestas` (`ID`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `responder_amigos`
--
ALTER TABLE `responder_amigos`
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_AMIGO` FOREIGN KEY (`ID_AMIGO`) REFERENCES `usuarios` (`CORREO`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_PREGUNTA` FOREIGN KEY (`ID_PREGUNTA`) REFERENCES `preguntas` (`ID`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `FOREIGNKEY_RESPUESTAS_ID_PREGUNTA` FOREIGN KEY (`ID_PREGUNTA`) REFERENCES `preguntas` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
