const express = require("express");
const router = express.Router();
const { obtenerProductos } = require("../controllers/productos.controller");

router.get("/", obtenerProductos);

module.exports = router;
