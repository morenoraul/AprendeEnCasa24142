const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Ruta principal de login
router.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Registro de usuario
router.post('/registro', loginController.registro);

// Inicio de sesión
router.post('/login', loginController.login);

// Cerrar sesión
router.get('/logout', loginController.logout);

// Ruta para obtener el formulario de login (si es necesario)
router.get('/ingreso', loginController.ingreso);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({mensaje: "Hola desde login routes"});
});

module.exports = router;
