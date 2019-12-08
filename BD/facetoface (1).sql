-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-12-2019 a las 13:08:40
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
  `ID_AMIGO` varchar(255) NOT NULL COMMENT 'id del amigo que manda la petición',
  `ESTADO` enum('ACEPTADO','PETICION') NOT NULL COMMENT 'estado de la peticion'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`ID_USUARIO`, `ID_AMIGO`, `ESTADO`) VALUES
('gdelga02@ucm.es', 'gdelga03@ucm.es', 'ACEPTADO'),
('gdelga02@ucm.es', 'prueba1@gmail.com', 'ACEPTADO'),
('gdelga03@ucm.es', 'gdelga02@ucm.es', 'ACEPTADO'),
('gdelga03@ucm.es', 'prueba1@gmail.com', 'ACEPTADO'),
('prueba1@gmail.com', 'gdelga02@ucm.es', 'ACEPTADO'),
('prueba1@gmail.com', 'gdelga03@ucm.es', 'ACEPTADO'),
('prueba2@gmail.com', 'gdelga03@ucm.es', 'PETICION');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `ID` int(4) NOT NULL COMMENT 'id de la pregunta',
  `CREADOR` varchar(255) NOT NULL COMMENT 'id del usuario que ha creado la pregunta',
  `PREGUNTA` varchar(255) NOT NULL COMMENT 'texto de la pregunta',
  `TIPO` varchar(255) NOT NULL COMMENT 'indica si son opciones, campo de texto o ambos'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('aWMk-5_pcrh9mNLBlPvLimXhFi9FpDPC', 1575849592, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"prueba1@gmail.com\",\"foto\":null,\"puntos\":0}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `CORREO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `CONTRASENA` varchar(255) NOT NULL COMMENT 'contraseña',
  `NOMBRE` varchar(255) NOT NULL COMMENT 'nombre completo',
  `GENERO` enum('Masculino','Femenino','Otro') NOT NULL COMMENT 'genero del usuario',
  `NACIMIENTO` date DEFAULT NULL COMMENT 'fecha de nacimiento',
  `FOTO` varchar(255) DEFAULT NULL COMMENT 'foto de perfil',
  `PUNTOS` int(4) NOT NULL DEFAULT '0' COMMENT 'puntuación del usuario'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`CORREO`, `CONTRASENA`, `NOMBRE`, `GENERO`, `NACIMIENTO`, `FOTO`, `PUNTOS`) VALUES
('gdelga02@ucm.es', 'Secreto', 'Guillermo Delgado', 'Masculino', '1997-01-25', '41b25181cf78faf053c5581bce7f40be', 0),
('gdelga03@ucm.es', 'Secreto', 'Prueba 1', 'Otro', '1995-03-22', 'ef1e8b8b423f880e84e6ac4781bc01a3', 0),
('prueba1@gmail.com', 'hola', 'Alberto Koala', 'Masculino', '1995-09-16', NULL, 0),
('prueba2@gmail.com', 'prueba', 'Prueba 2', 'Femenino', '2019-12-01', NULL, 0),
('prueba3@gmail.com', 'hola', 'Prueba 3', 'Otro', '2019-12-01', NULL, 0),
('prueba4@gmail.com', 'contra', 'Prueba 4', 'Femenino', NULL, NULL, 0);

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
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la pregunta';

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la respuesta';

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
