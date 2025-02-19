const express = require("express");
const router = express.Router();
const { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito} = require("../controllers/carrito.controller");
const verificarToken = require("../middlewares/authMiddleware");

router.get("/:usuario_id", verificarToken, obtenerCarrito);
router.post("/", verificarToken, agregarAlCarrito);
router.delete("/:id", verificarToken, eliminarDelCarrito);

module.exports = router;
