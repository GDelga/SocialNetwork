-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2019 a las 22:00:13
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

CREATE DATABASE IF NOT EXISTS facetoface;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_AMIGO` varchar(255) NOT NULL COMMENT 'id del amigo que manda la peticion',
  `ESTADO` enum('ACEPTADO','PETICION') NOT NULL COMMENT 'estado de la peticion'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`ID_USUARIO`, `ID_AMIGO`, `ESTADO`) VALUES
('adora@shera.com', 'scorpia@shera.com', 'ACEPTADO'),
('analacor@ucm.es', 'adora@shera.com', 'PETICION'),
('analacor@ucm.es', 'gdelga02@ucm.es', 'ACEPTADO'),
('analacor@ucm.es', 'prueba1@gmail.com', 'ACEPTADO'),
('arco@gmail.com', 'gdelga02@ucm.es', 'PETICION'),
('gatia@malvada.com', 'adora@shera.com', 'PETICION'),
('gatia@malvada.com', 'scorpia@shera.com', 'PETICION'),
('gdelga02@ucm.es', 'adora@shera.com', 'PETICION'),
('gdelga02@ucm.es', 'analacor@ucm.es', 'ACEPTADO'),
('gdelga02@ucm.es', 'scorpia@shera.com', 'ACEPTADO'),
('prueba1@gmail.com', 'analacor@ucm.es', 'ACEPTADO'),
('scorpia@shera.com', 'adora@shera.com', 'ACEPTADO'),
('scorpia@shera.com', 'gdelga02@ucm.es', 'ACEPTADO');

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

--
-- Volcado de datos para la tabla `fotos`
--

INSERT INTO `fotos` (`ID`, `ID_USUARIO`, `FOTO`, `TEXTO`) VALUES
(1, 'gdelga02@ucm.es', 'fd37fe06e1ddeef155e3413c7d4930da', 'La Capitana Ana');

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

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`ID`, `ID_USUARIO`, `TEXTO`, `VISTO`) VALUES
(6, 'gdelga02@ucm.es', 'Tu amig@ Ana Laura Corral ha fallado la pregunta: ¿Capitana Marvel o Wonder Woman?. Tú respondiste: Capitana Marvel y tu amig@: Wonder Woman.', 0),
(7, 'gdelga02@ucm.es', 'Tu amig@ Ana Laura Corral ha acertado la pregunta: ¿Cuál es tu personaje favorito de Marvel?. Tú respondiste: Ant Man y tu amig@: Ant Man.', 0),
(8, 'gdelga02@ucm.es', 'Tu amig@ Ana Laura Corral ha acertado la pregunta: ¿PS4, XBox One o Nintendo Switch?. Tú respondiste: PS4 y Nintendo Switch y tu amig@: PS4 y Nintendo Switch.', 0),
(9, 'gdelga02@ucm.es', 'Tu amig@ Ana Laura Corral ha acertado la pregunta: ¿Cuál es el personaje más irritante de Juego de Tronos?. Tú respondiste: Joffrey Baratheon y tu amig@: Joffrey Baratheon.', 0),
(10, 'gdelga02@ucm.es', 'Tu amig@ Ana Laura Corral ha fallado la pregunta: ¿Cuál es tu franquicia favorita?. Tú respondiste: Los Juegos del Hambre y tu amig@: Universo Marvel.', 0),
(11, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha acertado la pregunta: ¿Cuál es tu franquicia favorita?. Tú respondiste: Marvel y DC y tu amig@: Marvel y DC.', 0),
(12, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha fallado la pregunta: ¿Capitana Marvel o Wonder Woman?. Tú respondiste: Capitana Marvel y tu amig@: Wonder Woman.', 0),
(13, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha acertado la pregunta: ¿Cuál es tu personaje favorito de Marvel?. Tú respondiste: Capitana Marvel y tu amig@: Capitana Marvel.', 0),
(14, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha acertado la pregunta: ¿Cuál es tu personaje favorito de Marvel?. Tú respondiste: Capitana Marvel y tu amig@: Capitana Marvel.', 0),
(15, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha acertado la pregunta: ¿PS4, XBox One o Nintendo Switch?. Tú respondiste: PS3 y tu amig@: PS3.', 0),
(16, 'analacor@ucm.es', 'Tu amig@ Guillermo Delgado ha acertado la pregunta: ¿Cuál es el personaje más irritante de Juego de Tronos?. Tú respondiste: Joffrey Baratheon y tu amig@: Joffrey Baratheon.', 0),
(17, 'adora@shera.com', 'Tu amig@ Scorpia ha acertado la pregunta: ¿Cuál es tu personaje favorito de Shera?. Tú respondiste: Mara y tu amig@: Mara.', 0);

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
(1, 'gdelga02@ucm.es', '¿PS4, XBox One o Nintendo Switch?'),
(2, 'gdelga02@ucm.es', '¿Capitana Marvel o Wonder Woman?'),
(3, 'gdelga02@ucm.es', '¿Cuál es tu personaje favorito de Marvel?'),
(4, 'gdelga02@ucm.es', '¿Cuál es el personaje más irritante de Juego de Tronos?'),
(5, 'gdelga02@ucm.es', '¿Cuál es tu franquicia favorita?'),
(6, 'adora@shera.com', '¿Cuál es tu personaje favorito de Shera?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responder`
--

CREATE TABLE `responder` (
  `ID_USUARIO` varchar(255) NOT NULL COMMENT 'id del usuario',
  `ID_PREGUNTA` int(4) NOT NULL COMMENT 'id de la pregunta',
  `ID_RESPUESTA` int(4) NOT NULL COMMENT 'respuesta dada'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `responder`
--

INSERT INTO `responder` (`ID_USUARIO`, `ID_PREGUNTA`, `ID_RESPUESTA`) VALUES
('analacor@ucm.es', 2, 10),
('gdelga02@ucm.es', 2, 10),
('analacor@ucm.es', 4, 18),
('gdelga02@ucm.es', 4, 18),
('gdelga02@ucm.es', 5, 26),
('gdelga02@ucm.es', 3, 29),
('gdelga02@ucm.es', 1, 30),
('analacor@ucm.es', 1, 31),
('analacor@ucm.es', 5, 32),
('analacor@ucm.es', 3, 33),
('adora@shera.com', 6, 36),
('scorpia@shera.com', 6, 37);

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

--
-- Volcado de datos para la tabla `responder_amigos`
--

INSERT INTO `responder_amigos` (`ID_USUARIO`, `ID_AMIGO`, `ID_PREGUNTA`, `RESULTADO`) VALUES
('analacor@ucm.es', 'gdelga02@ucm.es', 1, 'ACERTADA'),
('analacor@ucm.es', 'gdelga02@ucm.es', 2, 'FALLADA'),
('analacor@ucm.es', 'gdelga02@ucm.es', 3, 'ACERTADA'),
('analacor@ucm.es', 'gdelga02@ucm.es', 4, 'ACERTADA'),
('analacor@ucm.es', 'gdelga02@ucm.es', 5, 'FALLADA'),
('gdelga02@ucm.es', 'analacor@ucm.es', 1, 'ACERTADA'),
('gdelga02@ucm.es', 'analacor@ucm.es', 2, 'FALLADA'),
('gdelga02@ucm.es', 'analacor@ucm.es', 3, 'ACERTADA'),
('gdelga02@ucm.es', 'analacor@ucm.es', 4, 'ACERTADA'),
('gdelga02@ucm.es', 'analacor@ucm.es', 5, 'ACERTADA'),
('scorpia@shera.com', 'adora@shera.com', 6, 'ACERTADA');

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
(5, 'Todas', 1, 1),
(10, 'Capitana Marvel', 2, 1),
(11, 'Wonder Woman', 2, 1),
(12, 'Iron Man', 3, 1),
(13, 'Capitán América', 3, 1),
(14, 'Viuda Negra', 3, 1),
(15, 'Thor', 3, 1),
(16, 'Hulk', 3, 1),
(17, 'Ojo de Halcón', 3, 1),
(18, 'Joffrey Baratheon', 4, 1),
(19, 'Cersei Lannister', 4, 1),
(20, 'Sansa Stark', 4, 1),
(21, 'Petyr Baelish', 4, 1),
(22, 'Ramsay Nieve', 4, 1),
(23, 'Tywin Lannister', 4, 1),
(24, 'Harry Potter', 5, 1),
(25, 'Star Wars', 5, 1),
(26, 'Los Juegos del Hambre', 5, 1),
(27, 'Universo DC', 5, 1),
(28, 'Universo Marvel', 5, 1),
(29, 'Ant Man', 3, 0),
(30, 'PS4 y Nintendo Switch', 1, 0),
(31, 'PS3', 1, 0),
(32, 'Marvel y DC', 5, 0),
(33, 'Capitana Marvel', 3, 0),
(34, 'Shera', 6, 1),
(35, 'Adora', 6, 1),
(36, 'Mara', 6, 1),
(37, 'Gatia', 6, 1),
(38, 'Destello', 6, 1),
(39, 'Arco', 6, 1),
(40, 'Flora', 6, 0),
(41, 'Scorpia', 6, 0),
(42, 'Tecnia', 6, 0),
(43, 'Sirénida', 6, 0),
(44, 'Escarcha', 6, 0),
(45, 'Rayo de Esperanza', 6, 0),
(46, 'Halcón de Mar', 6, 0),
(47, 'Tejesombras', 6, 0);

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
('adora@shera.com', 'Shera', 'Adora', 'Femenino', NULL, 'eb9abd94372f8bf31ba7bb1cfea362fb', 0),
('analacor@ucm.es', 'CapitanaMarvel', 'Ana Laura Corral', 'Femenino', '1994-10-14', 'e3bb42b2f21ec248f54f8fc30218fa0f', 150),
('arco@gmail.com', 'Secreto', 'Arco', 'Masculino', NULL, 'ea3205c86a9b6ec3fd062cdbce6a2d5e', 0),
('dreamgirl@gmail.com', 'CapitanaMarvel', 'Dream Girl', 'Otro', NULL, 'ac0fff445830a2706869f29bac9c785c', 0),
('gatia@malvada.com', 'LoveShera', 'Gatia', 'Femenino', NULL, 'bd40f3d3345151f1a0ff990df65e4a5a', 0),
('gdelga02@ucm.es', 'Secreto', 'Guillermo Delgado', 'Masculino', '1997-03-25', '41b25181cf78faf053c5581bce7f40be', 150),
('larosalia@gmail.com', 'Prueba1', 'La Rosalia', 'Femenino', '1993-09-25', 'ebd6a38749c76c8d6ae5232f96ac6f37', 0),
('prueba1@gmail.com', 'Prueba1', 'Raquel Campos', 'Femenino', '1995-05-31', '479dd39ce62af4334ce6f93072a143aa', 0),
('scorpia@shera.com', 'Secreto', 'Scorpia', 'Femenino', NULL, '82ee424b26bf35154ffec043fe96ab72', 50);

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
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FOREIGNKEY_NOTIFICACIONES_USUARIO` (`ID_USUARIO`);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id de la notificacion', AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la pregunta', AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id de la respuesta', AUTO_INCREMENT=48;

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
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `FOREIGNKEY_NOTIFICACIONES_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`CORREO`);

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
