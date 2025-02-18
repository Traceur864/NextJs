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
    const { usuario_id } = req.body;
    console.log('datos del usuario:'+req.body);
    

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
  
      // Insertar el pedido en la base de datos
      const queryPedido = "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)";
      db.query(queryPedido, [usuario_id, total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
  
        const pedido_id = result.insertId;
  
        // Vaciar el carrito después de hacer el pedido
        db.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          res.json({ mensaje: "Pedido realizado con éxito", pedido_id });
        });
      });
    });
  };

// Obtener pedidos de un usuario
exports.obtenerPedidos = (req, res) => {
  const { usuario_id } = req.params;

  const query = "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC";
  db.query(query, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};
