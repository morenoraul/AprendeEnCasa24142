// Subida al servidor proximamente

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/registrar', (req, res) => {
    const { nombre, apellido, email, dni, contrasena, rol, nivelAcademico } = req.body;

    // Aquí puedes realizar la lógica para registrar al usuario en tu base de datos o sistema de autenticación

    // Simulamos un registro exitoso
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});