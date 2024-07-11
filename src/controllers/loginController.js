const { conn } = require("../db/dbconnect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  registro: async (req, res) => {
    const { nombre, apellido, email, dni, contrasena, rol, nivelAcademico } = req.body;
    
    try {
      await conn.beginTransaction();

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const [resultUsuario] = await conn.query(
        "INSERT INTO usuarios (nombre, apellido, email, dni, contrasena) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellido, email, dni, hashedPassword]
      );

      const usuarioId = resultUsuario.insertId;

      const [roles] = await conn.query("SELECT id FROM roles WHERE nombre = ?", [rol]);
      const [niveles] = await conn.query("SELECT id FROM niveles_academicos WHERE nombre = ?", [nivelAcademico]);

      await conn.query(
        "INSERT INTO perfiles_usuario (usuario_id, rol_id, nivel_academico_id) VALUES (?, ?, ?)",
        [usuarioId, roles[0].id, niveles[0].id]
      );

      await conn.commit();
      res.status(201).json({ success: true, message: "Usuario registrado exitosamente" });
    } catch (error) {
      await conn.rollback();
      console.error(error);
      res.status(500).json({ success: false, message: "Error al registrar usuario" });
    } finally {
      conn.releaseConnection();
    }
  },

  login: async (req, res) => {
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

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        success: true, 
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error en el inicio de sesión" });
    } finally {
      conn.releaseConnection();
    }
  },

  logout: (req, res) => {
    // En el caso de usar JWT, el logout se maneja del lado del cliente
    // eliminando el token almacenado
    res.json({ success: true, message: "Sesión cerrada exitosamente" });
  },

  ingreso: (req, res) => {
    // Esta función puede ser usada para verificar si el usuario está autenticado
    // y devolver información relevante si es necesario
    res.json({ message: "Acceso al formulario de login" });
  }
};