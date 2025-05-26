CREATE DATABASE IF NOT EXISTS bdL22100217;
USE bdL22100217;
 
DROP TABLE IF EXISTS JugadoresBeisbol;
 
CREATE TABLE JugadoresBeisbol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    posicion VARCHAR(50),
    numero_camiseta INT
);

INSERT INTO JugadoresBeisbol (nombre, apellido, posicion, numero_camiseta) VALUES
('Albert', 'Pujols', 'Primera base', 5),
('Mike', 'Trout', 'Jardinero central', 27),
('Derek', 'Jeter', 'Campo corto', 2),
('Babe', 'Ruth', 'Bateador designado', 3),
('Mickey', 'Mantle', 'Jardinero central', 7);

SELECT * FROM JugadoresBeisbol;