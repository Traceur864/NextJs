const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Importar rutas
const productosRoutes = require("./routes/productos.routes");
const carritoRoutes = require("./routes/carrito.routes");
const pedidosRoutes = require("./routes/pedidos.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
