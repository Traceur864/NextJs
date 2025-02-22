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
('Juan Pérez', 'juan@correo.com', '$2b$10$B5gptUy41R3sw29AQlb7C.fr5C5SX9ol6va2FYuEx0keiv019/xDS'),
('María López', 'maria@correo.com', '$2b$10$B5gptUy41R3sw29AQlb7C.fr5C5SX9ol6va2FYuEx0keiv019/xDS'),
('Carlos Gómez', 'carlos@correo.com', '$2b$10$B5gptUy41R3sw29AQlb7C.fr5C5SX9ol6va2FYuEx0keiv019/xDS'),
('Edwin Lopez', 'edwin@correo.com', '$2b$10$B5gptUy41R3sw29AQlb7C.fr5C5SX9ol6va2FYuEx0keiv019/xDS');

INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES
('Laptop Gamer', 'Laptop potente con procesador i7 y tarjeta gráfica RTX 3060.', 1500.00, 'laptop.jpg'),
('Teléfono Inteligente', 'Smartphone de última generación con cámara de 108MP.', 800.00, 'telefono.jpg'),
('Auriculares Inalámbricos', 'Auriculares con cancelación de ruido y alta fidelidad de sonido.', 120.00, 'auriculares.jpg'),
('Monitor 4K', 'Monitor UHD 4K de 27 pulgadas con tecnología IPS.', 350.00, 'monitor.jpg'),
('Teclado Mecánico', 'Teclado mecánico RGB con switches personalizables.', 90.00, 'teclado.jpg'),
('Mouse Gamer', 'Mouse ergonómico con sensor óptico de alta precisión.', 60.00, 'mouse.jpg'),
('Silla Ergonómica', 'Silla de oficina ergonómica con soporte lumbar ajustable.', 250.00, 'silla.jpg'),
('Tablet Android', 'Tablet con pantalla de 10 pulgadas y batería de larga duración.', 400.00, 'tablet.jpg'),
('Smartwatch', 'Reloj inteligente con monitoreo de salud y GPS integrado.', 200.00, 'smartwatch.jpg'),
('Cámara Profesional', 'Cámara réflex digital con lente de 24MP y grabación en 4K.', 1200.00, 'camara.jpg');

#DROP DATABASE E_COMMERCE;
