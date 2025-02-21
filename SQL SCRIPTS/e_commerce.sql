CREATE DATABASE E_COMMERCE;
USE E_COMMERCE;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
#DROP TABLE usuarios;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255)
);
#DROP TABLE productos;

CREATE TABLE direcciones_envio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
#DROP TABLE direcciones_envio;

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
#DROP TABLE carrito;

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
#DROP TABLE pedidos;

CREATE TABLE pedido_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
#DROP TABLE pedido_detalle;

INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@example.com', '123456'),
('María López', 'maria@example.com', 'abcdef'),
('Carlos Gómez', 'carlos@example.com', 'password123'),
('Edwin', 'edwin@correo.com', '$2b$10$B5gptUy41R3sw29AQlb7C.fr5C5SX9ol6va2FYuEx0keiv019/xDS');

INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES
('Laptop Gamer', 'Laptop potente con procesador i7 y tarjeta gráfica RTX 3060.', 1500.00, 'laptop.jpg'),
('Teléfono Inteligente', 'Smartphone de última generación con cámara de 108MP.', 800.00, 'telefono.jpg'),
('Auriculares Inalámbricos', 'Auriculares con cancelación de ruido y alta fidelidad de sonido.', 120.00, 'auriculares.jpg');

#DROP DATABASE E_COMMERCE;
