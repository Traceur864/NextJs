const db = require("../config/db");
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
      // Verificar si la carpeta existe, si no, crearla
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath); // Carpeta donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
      
      cb(null, Date.now() + file.originalname); // Añadir la extensión original
    }
  });

  const upload = multer({ storage: storage });

// Realizar un pedido
exports.realizarPedido = (req, res) => {
  const { usuario_id, direccion, nombre, correo, telefono } = req.body;

  if (!usuario_id || !direccion) {
    return res.status(400).json({ error: "Usuario y dirección son requeridos." });
  }

  // Insertar la dirección de envío
  db.query(
    "INSERT INTO direcciones_envio (usuario_id, nombre, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, nombre, correo, telefono, direccion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Obtener los productos en el carrito
      const queryCarrito = `
        SELECT producto_id, cantidad, p.precio 
        FROM carrito c
        JOIN productos p ON c.producto_id = p.id
        WHERE usuario_id = ?`;

      db.query(queryCarrito, [usuario_id], (err, productos) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (productos.length === 0) {
          return res.status(400).json({ mensaje: "El carrito está vacío" });
        }

        // Calcular el total del pedido
        const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

        // Insertar el pedido
        const queryPedido = "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)";
        db.query(queryPedido, [usuario_id, total], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const pedido_id = result.insertId;

          // Insertar los productos del pedido en la tabla pedido_detalle
          const queryDetalle = "INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio, subtotal) VALUES ?";
          const detalles = productos.map(p => [
            pedido_id, 
            p.producto_id, 
            p.cantidad, 
            p.precio, 
            p.precio * p.cantidad
          ]);

          db.query(queryDetalle, [detalles], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Vaciar el carrito después de hacer el pedido
            db.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id], (err) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({ mensaje: "Pedido realizado con éxito", pedido_id });
            });
          });
        });
      });
    });
};



/* // Obtener pedidos de un usuario
exports.obtenerPedidos = (req, res) => {
  const { usuario_id } = req.params;

  const query = "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC";
  db.query(query, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
}; */

// Obtener pedidos de un usuario
exports.obtenerPedidos = (req, res) => {
  const { usuario_id } = req.params;

  const query = `
    SELECT p.id AS pedido_id, p.total, p.fecha, pd.producto_id, pr.nombre, pd.cantidad, pr.precio, (pd.cantidad * pr.precio) AS subtotal
    FROM pedidos p
    JOIN pedido_detalle pd ON p.id = pd.pedido_id
    JOIN productos pr ON pd.producto_id = pr.id
    WHERE p.usuario_id = ?
    ORDER BY p.fecha DESC
  `;

  db.query(query, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const pedidos = [];
    let currentPedido = null;

    results.forEach(row => {
      if (!currentPedido || currentPedido.id !== row.pedido_id) {
        if (currentPedido) {
          pedidos.push(currentPedido);
        }

        currentPedido = {
          id: row.pedido_id,
          total: row.total,
          fecha: row.fecha,
          productos: []
        };
      }

      currentPedido.productos.push({
        nombre: row.nombre,
        cantidad: row.cantidad,
        precio: row.precio,
        subtotal: row.subtotal
      });
    });

    if (currentPedido) {
      pedidos.push(currentPedido);
    }

    res.json(pedidos);
  });
};

