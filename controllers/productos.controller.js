const db = require("../config/db");

exports.obtenerProductos = (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
};
