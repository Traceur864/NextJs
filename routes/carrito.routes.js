const express = require("express");
const router = express.Router();
const { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito} = require("../controllers/carrito.controller");

router.get("/:usuario_id", obtenerCarrito);
router.post("/", agregarAlCarrito);
router.delete("/:id", eliminarDelCarrito);

module.exports = router;
