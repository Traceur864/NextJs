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

// Obtener los productos del carrito de un usuario
exports.obtenerCarrito = (req, res) => {
  const { usuario_id } = req.params;
  const query = `
    SELECT c.id, p.nombre, p.precio, c.cantidad, p.imagen 
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    WHERE c.usuario_id = ?`;

  db.query(query, [usuario_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Agregar un producto al carrito
exports.agregarAlCarrito = [upload.none(), async (req, res) => {
    const { usuario_id, producto_id, cantidad } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!usuario_id || !producto_id || !cantidad) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    db.query(
      "SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [usuario_id, producto_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
          const nuevaCantidad = results[0].cantidad + cantidad;
          db.query(
            "UPDATE carrito SET cantidad = ? WHERE id = ?",
            [nuevaCantidad, results[0].id],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ mensaje: "Cantidad actualizada en el carrito" });
            }
          );
        } else {
          db.query(
            "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
            [usuario_id, producto_id, cantidad],
            (err, result) => {
              if (err) return res.status(500).json({ error: err.message });

              console.log("Producto agregado con ID:", result.insertId);
              res.json({ mensaje: "Producto agregado al carrito" });
            }
          );
        }
      }
    );
}];


// Eliminar un producto del carrito
exports.eliminarDelCarrito = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM carrito WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Producto eliminado del carrito" });
  });
};
