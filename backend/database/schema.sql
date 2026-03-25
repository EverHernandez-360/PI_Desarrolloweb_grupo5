-- Base de datos para aplicación de ratings de catedráticos
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS profesor_ratings CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE profesor_ratings;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registro_academico VARCHAR(10) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de catedráticos
CREATE TABLE catedraticos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  apellido VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  creditos INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación cursos-catedráticos
CREATE TABLE curso_catedratico (
  id INT PRIMARY KEY AUTO_INCREMENT,
  curso_id INT NOT NULL,
  catedratico_id INT NOT NULL,
  semestre VARCHAR(20),
  anno INT,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id)
);

-- Tabla de publicaciones
CREATE TABLE publicaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  tipo ENUM('catedratico', 'curso') NOT NULL,
  referencia_id INT NOT NULL, -- ID del catedrático o curso
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_tipo_referencia (tipo, referencia_id),
  INDEX idx_fecha (fecha_creacion)
);

-- Tabla de comentarios
CREATE TABLE comentarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_publicacion (publicacion_id)
);

-- Tabla de cursos aprobados por usuario
CREATE TABLE cursos_aprobados (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  curso_id INT NOT NULL,
  calificacion DECIMAL(5,2),
  fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  UNIQUE KEY unique_usuario_curso (usuario_id, curso_id)
);

-- Inserciones de ejemplo (datos de cursos del área de sistemas)
INSERT INTO catedraticos (nombre, apellido, email) VALUES
('Herman', 'Véliz', 'hvl@usac.edu.gt'),
('Juan', 'Pérez', 'jperez@usac.edu.gt'),
('María', 'García', 'mgarcia@usac.edu.gt'),
('Carlos', 'López', 'clopez@usac.edu.gt');

INSERT INTO cursos (codigo, nombre, descripcion, creditos) VALUES
('IPC2', 'Introducción a la Programación en C', 'Curso introductorio de programación', 4),
('SO1', 'Sistemas Operativos 1', 'Conceptos básicos de sistemas operativos', 4),
('ED1', 'Estructuras de Datos 1', 'Estructuras de datos fundamentales', 4),
('BD1', 'Bases de Datos 1', 'Introducción a bases de datos relacionales', 4),
('LFP', 'Lenguajes Formales y Programación', 'Teoría de compiladores', 4);

-- Crear índices adicionales para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_registro ON usuarios(registro_academico);
