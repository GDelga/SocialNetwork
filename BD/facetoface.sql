-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-10-2019 a las 19:02:56
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
  `ESTADO` enum('ACEPTADO','RECHAZADO','PETICION') NOT NULL COMMENT 'estado de la peticion'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `ID` int(4) NOT NULL COMMENT 'id de la pregunta',
  `PREGUNTA` varchar(255) NOT NULL COMMENT 'texto de la pregunta',
  `TIPO` varchar(255) NOT NULL COMMENT 'indica si son opciones, campo de texto o ambos',
  `RESPUESTAS` varchar(255) DEFAULT NULL COMMENT 'contenido de las opciones posibles'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responder`
--

CREATE TABLE `responder` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta',
  `RESPUESTA` varchar(255) NOT NULL COMMENT 'respuesta dada'
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
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `CORREO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `CONTRASENA` varchar(255) NOT NULL COMMENT 'contraseña',
  `NOMBRE` varchar(255) NOT NULL COMMENT 'nombre completo',
  `GENERO` enum('MASCULINO','FEMENINO','OTRO') NOT NULL COMMENT 'genero del usuario',
  `NACIMIENTO` date DEFAULT NULL COMMENT 'fecha de nacimiento',
  `FOTO` varchar(255) DEFAULT NULL COMMENT 'foto de perfil'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `responder`
--
ALTER TABLE `responder`
  ADD PRIMARY KEY (`ID_USUARIO`,`ID_PREGUNTA`),
  ADD KEY `FOREIGNKEY_RESPONDER_ID_PREGUNTA` (`ID_PREGUNTA`);

--
-- Indices de la tabla `responder_amigos`
--
ALTER TABLE `responder_amigos`
  ADD PRIMARY KEY (`ID_USUARIO`,`ID_AMIGO`,`ID_PREGUNTA`) USING BTREE,
  ADD KEY `FOREIGNKEY_RESPONDER_AMIGO_ID_AMIGO` (`ID_AMIGO`),
  ADD KEY `FOREIGNKEY_RESPONDER_AMIGO_ID_PREGUNTA` (`ID_PREGUNTA`);

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
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `FOREIGNKEY_AMIGO_ID_AMIGO` FOREIGN KEY (`ID_AMIGO`) REFERENCES `usuarios` (`CORREO`),
  ADD CONSTRAINT `FOREIGNKEY_AMIGO_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `responder`
--
ALTER TABLE `responder`
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_ID_PREGUNTA` FOREIGN KEY (`ID_PREGUNTA`) REFERENCES `preguntas` (`ID`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

--
-- Filtros para la tabla `responder_amigos`
--
ALTER TABLE `responder_amigos`
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_AMIGO` FOREIGN KEY (`ID_AMIGO`) REFERENCES `usuarios` (`CORREO`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_PREGUNTA` FOREIGN KEY (`ID_PREGUNTA`) REFERENCES `preguntas` (`ID`),
  ADD CONSTRAINT `FOREIGNKEY_RESPONDER_AMIGO_ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
