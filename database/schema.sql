CREATE DATABASE IF NOT EXISTS db_lab10
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_lab10;

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(500) NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_productos_precio CHECK (precio >= 0),
  CONSTRAINT chk_productos_stock CHECK (stock >= 0)
);

INSERT INTO productos (nombre, descripcion, precio, stock)
SELECT 'Teclado mecánico', 'Teclado USB para oficina y gaming', 150.00, 10
WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);
