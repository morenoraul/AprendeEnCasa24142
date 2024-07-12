const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Clave secreta para JWT (debería estar en una variable de entorno en producción)
const JWT_SECRET = 'tu_clave_secreta_muy_segura';

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: 'mysql-aprenderencasa.alwaysdata.net',
  user: '368507_grupo19',
  password: '@Prender3nc@sa2024',
  database: 'aprenderencasa_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const conn = pool.promise();

app.use(express.json());
app.use(express.static('public'));

app.post('/registrar', async (req, res) => {
    const { nombre, apellido, email, dni, contrasena, rol, nivelAcademico } = req.body;

    try {
        await conn.beginTransaction();

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar usuario
        const [resultUsuario] = await conn.query(
            "INSERT INTO usuarios (nombre, apellido, email, dni, contrasena) VALUES (?, ?, ?, ?, ?)",
            [nombre, apellido, email, dni, hashedPassword]
        );

        const usuarioId = resultUsuario.insertId;

        // Obtener IDs de rol y nivel académico
        const [roles] = await conn.query("SELECT id FROM roles WHERE nombre = ?", [rol]);
        const [niveles] = await conn.query("SELECT id FROM niveles_academicos WHERE nombre = ?", [nivelAcademico]);

        // Insertar perfil de usuario
        await conn.query(
            "INSERT INTO perfiles_usuario (usuario_id, rol_id, nivel_academico_id) VALUES (?, ?, ?)",
            [usuarioId, roles[0].id, niveles[0].id]
        );

        await conn.commit();

        // Generar token JWT
        const token = jwt.sign({ userId: usuarioId, email: email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, message: "Usuario registrado exitosamente", token });
    } catch (error) {
        await conn.rollback();
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ success: false, message: "Error al registrar usuario" });
    }
});

app.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        const [usuarios] = await conn.query(
            "SELECT u.id, u.nombre, u.apellido, u.email, u.contrasena, r.nombre AS rol " +
            "FROM usuarios u " +
            "INNER JOIN perfiles_usuario pu ON u.id = pu.usuario_id " +
            "INNER JOIN roles r ON pu.rol_id = r.id " +
            "WHERE u.email = ?",
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }

        const usuario = usuarios[0];
        const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }

        // Generar token JWT
        const token = jwt.sign({ userId: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ success: false, message: "Error en el inicio de sesión" });
    }
});

app.post('/validar-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, valid: true, userId: decoded.userId });
    } catch (error) {
        res.status(401).json({ success: false, valid: false, message: "Token inválido" });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});