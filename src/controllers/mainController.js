const { conn } = require("../db/dbconnect");
module.exports = {
  getListado: async (req, res) => {
    try {
      const [usuarios] = await conn.query(
        "SELECT u.id, u.nombre, u.apellido, u.email, u.dni, r.nombre AS rol, na.nombre AS nivel_academico " +
        "FROM usuarios u " +
        "INNER JOIN perfiles_usuario pu ON u.id = pu.usuario_id " +
        "INNER JOIN roles r ON pu.rol_id = r.id " +
        "INNER JOIN niveles_academicos na ON pu.nivel_academico_id = na.id"
      );
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el listado de usuarios" });
    } finally {
      conn.releaseConnection();
    }
  },

  crearRegistro: async (req, res) => {
    const { nombre, apellido, email, dni, contrasena, rol, nivelAcademico } = req.body;
    
    try {
      await conn.beginTransaction();

      const [resultUsuario] = await conn.query(
        "INSERT INTO usuarios (nombre, apellido, email, dni, contrasena) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellido, email, dni, contrasena] // En una aplicación real, hashear la contraseña
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

  getModificar: async (req, res) => {
    try {
      const [usuario] = await conn.query(
        "SELECT u.*, r.nombre AS rol, na.nombre AS nivel_academico " +
        "FROM usuarios u " +
        "INNER JOIN perfiles_usuario pu ON u.id = pu.usuario_id " +
        "INNER JOIN roles r ON pu.rol_id = r.id " +
        "INNER JOIN niveles_academicos na ON pu.nivel_academico_id = na.id " +
        "WHERE u.id = ?",
        [req.params.id]
      );

      if (usuario.length > 0) {
        res.json(usuario[0]);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener datos del usuario" });
    } finally {
      conn.releaseConnection();
    }
  },

  actualizar: async (req, res) => {
    const { id, nombre, apellido, email, dni, rol, nivelAcademico } = req.body;
    
    try {
      await conn.beginTransaction();

      await conn.query(
        "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, dni = ? WHERE id = ?",
        [nombre, apellido, email, dni, id]
      );

      const [roles] = await conn.query("SELECT id FROM roles WHERE nombre = ?", [rol]);
      const [niveles] = await conn.query("SELECT id FROM niveles_academicos WHERE nombre = ?", [nivelAcademico]);

      await conn.query(
        "UPDATE perfiles_usuario SET rol_id = ?, nivel_academico_id = ? WHERE usuario_id = ?",
        [roles[0].id, niveles[0].id, id]
      );

      await conn.commit();
      res.json({ success: true, message: "Usuario actualizado exitosamente" });
    } catch (error) {
      await conn.rollback();
      console.error(error);
      res.status(500).json({ success: false, message: "Error al actualizar usuario" });
    } finally {
      conn.releaseConnection();
    }
  },

  eliminar: async (req, res) => {
    const { id } = req.body;
    
    try {
      await conn.beginTransaction();

      await conn.query("DELETE FROM perfiles_usuario WHERE usuario_id = ?", [id]);
      await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);

      await conn.commit();
      res.json({ success: true, message: "Usuario eliminado exitosamente" });
    } catch (error) {
      await conn.rollback();
      console.error(error);
      res.status(500).json({ success: false, message: "Error al eliminar usuario" });
    } finally {
      conn.releaseConnection();
    }
  },

  consultar: async (req, res) => {
    const { id } = req.params;
    
    try {
      const [usuario] = await conn.query(
        "SELECT u.*, r.nombre AS rol, na.nombre AS nivel_academico " +
        "FROM usuarios u " +
        "INNER JOIN perfiles_usuario pu ON u.id = pu.usuario_id " +
        "INNER JOIN roles r ON pu.rol_id = r.id " +
        "INNER JOIN niveles_academicos na ON pu.nivel_academico_id = na.id " +
        "WHERE u.id = ?",
        [id]
      );

      if (usuario.length > 0) {
        res.json(usuario[0]);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al consultar usuario" });
    } finally {
      conn.releaseConnection();
    }
  }
};