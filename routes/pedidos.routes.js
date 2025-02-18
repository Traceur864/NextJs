const express = require("express");
const router = express.Router();
const { realizarPedido, obtenerPedidos } = require("../controllers/pedidos.controller");

router.post("/", realizarPedido);
router.get("/:usuario_id", obtenerPedidos);

module.exports = router;
