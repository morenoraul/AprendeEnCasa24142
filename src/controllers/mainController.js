const { conn } = require('../db/dbconnect')

module.exports = {
		getListado: async (req, res) => {
				try {
						const [registros] = await conn.query(`SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos`)
						res.json(registros)
				} catch (error) {
						console.error('Error al obtener listado:', error)
						res.status(500).json({ error: 'Error interno del servidor' })
				} finally {
						conn.releaseConnection()
				}
		},

		crearRegistro: async (req, res) => {
				try {
						const { curso, precio, cantidadhoras } = req.body

						// Validar que todos los campos necesarios estén presentes
						if (!curso || !precio || !cantidadhoras) {
								return res.status(400).json({ error: 'Todos los campos son obligatorios' })
						}

						// Convertir precio y cantidadhoras a números
						const precioNum = parseFloat(precio)
						const horasNum = parseInt(cantidadhoras, 10)

						if (isNaN(precioNum) || isNaN(horasNum)) {
								return res.status(400).json({ error: 'El precio y la cantidad de horas deben ser números válidos' })
						}

						const sql = `INSERT INTO pedidos (codcurso, precio, cantidadhoras) VALUES (?, ?, ?);`
						await conn.query(sql, [curso, precioNum, horasNum])

						res.redirect('/listado.html')
				} catch (error) {
						console.error('Error al crear registro:', error)
						res.status(500).json({ error: 'Error interno del servidor' })
				}
		},

		getModificar: async (req, res) => {
				try {
						const [modificar] = await conn.query(`SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos WHERE nromov=?`, [req.params.num]);

						if (modificar.length === 0) {
								return res.status(404).send('Registro no encontrado');
						}

						res.render('modificar', {
								title: 'Modificar',
								registro: modificar[0]
						});
				} catch (error) {
						console.error('Error al obtener datos para modificar:', error);
						res.status(500).send('Error interno del servidor');
				}
		},


		actualizar: async (req, res) => {
				try {
						const sql = `UPDATE pedidos SET codcurso = ?, precio = ?, cantidadhoras = ? WHERE nromov = ?`
						const { idActualizar, codcurso_actualizar, precio, cantidadhoras } = req.body

						// Validar que todos los campos necesarios estén presentes
						if (!idActualizar || !codcurso_actualizar || !precio || !cantidadhoras) {
								return res.status(400).json({ error: 'Todos los campos son obligatorios' })
						}

						// Convertir precio y cantidadhoras a números
						const precioNum = parseFloat(precio)
						const horasNum = parseInt(cantidadhoras, 10)

						if (isNaN(precioNum) || isNaN(horasNum)) {
								return res.status(400).json({ error: 'El precio y la cantidad de horas deben ser números válidos' })
						}

						await conn.query(sql, [codcurso_actualizar, precioNum, horasNum, idActualizar])
						res.redirect('/listado.html')
				} catch (error) {
						console.error('Error al actualizar:', error)
						res.status(500).json({ error: 'Error interno del servidor' })
				}
		},

		eliminar: async (req, res) => {
				try {
						await conn.query(`DELETE FROM pedidos WHERE nromov=?`, req.body.idEliminar)
						res.redirect('/listado.html')
				} catch (error) {
						console.error('Error al eliminar:', error)
						res.status(500).json({ error: 'Error interno del servidor' })
				}
		},
}