const express = require("express");
const router = express.Router();
const controladores = require("../controllers/mainController");
const auth = require("./../config/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// Rutas principales
router.get("/", (req, res) => res.redirect("/index.html"));
router.get("/login", (req, res) => res.sendFile("login.html", { root: "./public" }));
router.get("/registrate", (req, res) => res.sendFile("registrate.html", { root: "./public" }));
router.get("/sitioDocente", (req, res) => res.sendFile("sitioDocente.html", { root: "./public" }));

// Rutas de API
router.get("/api/usuarios", auth, controladores.getListado);
router.post("/api/usuarios", upload.single("archivo"), controladores.crearRegistro);
router.get("/api/usuarios/:id", controladores.getModificar);
router.put("/api/usuarios/:id", controladores.actualizar);
router.delete("/api/usuarios/:id", controladores.eliminar);
router.get("/api/usuarios/:id/consultar", controladores.consultar);

// Ruta de login
router.post("/api/login", controladores.login);

module.exports = router;