const jwt = require("jsonwebtoken");
const SECRET_KEY = "mi_clave_secreta";

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Acceso denegado. No hay token." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
};

module.exports = verificarToken;
