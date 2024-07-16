console.log('mainController loaded');
const { conn } = require('../db/dbconnect');

module.exports = {
		getListado: async (req, res) => {
				try {
						const [registros] = await conn.query(`SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos`);
						res.json(registros);
				} catch (error) {
						console.error('Error al obtener listado:', error);
						res.status(500).json({ error: 'Error interno del servidor' });
				}
		},

		crearRegistro: async (req, res) => {
				try {
						console.log('Datos recibidos para crear registro:', req.body);
						const { curso, precio, cantidadhoras, codcli } = req.body;

						// Validación de datos
						if (!curso || !precio || !cantidadhoras || !codcli) {
								console.log('Datos incompletos');
								return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios, incluyendo codcli' });
						}

						const precioNum = parseFloat(precio);
						const horasNum = parseInt(cantidadhoras, 10);
						const codcliNum = parseInt(codcli, 10);

						if (isNaN(precioNum) || isNaN(horasNum) || isNaN(codcliNum)) {
								console.log('Datos inválidos');
								return res.status(400).json({ success: false, message: 'El precio, la cantidad de horas y codcli deben ser números válidos' });
						}

						// Primero, verifica si el cliente existe
						const [clienteExiste] = await conn.query('SELECT id FROM clientes WHERE id = ?', [codcliNum]);
						if (clienteExiste.length === 0) {
								return res.status(400).json({ success: false, message: 'El cliente especificado no existe' });
						}

						const sql = `INSERT INTO pedidos (codcurso, precio, cantidadhoras, codcli) VALUES (?, ?, ?, ?);`;
						const [result] = await conn.query(sql, [curso, precioNum, horasNum, codcliNum]);

						console.log('Resultado de la inserción:', result);

						if (result.affectedRows > 0) {
								res.status(201).json({ success: true, message: 'Registro creado con éxito', id: result.insertId });
						} else {
								res.status(500).json({ success: false, message: 'No se pudo crear el registro' });
						}
				} catch (error) {
						console.error('Error detallado al crear registro:', error);
						res.status(500).json({ success: false, message: 'Error al crear el registro', error: error.message });
				}
		},

		getModificar: async (req, res) => {
				try {
						const id = req.params.id;
						const [modificar] = await conn.query('SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos WHERE nromov = ?', [id]);
	
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
						const { id } = req.params;
						const { codcurso, precio, cantidadhoras } = req.body;
	
						if (!id || !codcurso || !precio || !cantidadhoras) {
								return res.status(400).json({ error: 'Todos los campos son obligatorios' });
						}
	
						const sql = 'UPDATE pedidos SET codcurso = ?, precio = ?, cantidadhoras = ? WHERE nromov = ?';
						const [result] = await conn.query(sql, [codcurso, precio, cantidadhoras, id]);
	
						if (result.affectedRows === 0) {
								return res.status(404).json({ error: 'Registro no encontrado' });
						}
	
						res.json({ message: 'Registro actualizado con éxito' });
				} catch (error) {
						console.error('Error al actualizar:', error);
						res.status(500).json({ error: 'Error interno del servidor' });
				}
		},

	 	eliminar: async (req, res) => {
				try {
						const id = req.params.id; // Asumiendo que el ID viene en los parámetros de la URL
						console.log('Intentando eliminar registro con id:', id);
	
						const [result] = await conn.query('DELETE FROM pedidos WHERE nromov = ?', [id]);
	
						if (result.affectedRows > 0) {
								res.json({ success: true, message: 'Registro eliminado con éxito' });
						} else {
								res.status(404).json({ success: false, message: 'No se encontró el registro para eliminar' });
						}
				} catch (error) {
						console.error('Error detallado al eliminar:', error);
						res.status(500).json({ success: false, message: 'Error al eliminar el registro', error: error.message });
				}
		},
};
