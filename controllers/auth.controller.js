const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

// Clave secreta para firmar el token
const SECRET_KEY = "mi_clave_secreta";

// 🔹 Login de usuario
exports.login = [upload.none(), (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  });
}];

// 🔹 Registro de usuario (Opcional)
exports.register = [upload.none(), async (req, res) => {
  const { nombre, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      res.json({ mensaje: "Usuario registrado exitosamente" });
    }
  );
}];
