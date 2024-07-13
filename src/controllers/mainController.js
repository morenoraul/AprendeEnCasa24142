cconst { conn } = require('../db/dbconnect')

module.exports = {

	getListado: async (req, res) => {
		try{
			const [ registros ] = await conn.query(`SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos`)
			res.json(registros)
		} catch (error) {
			throw error
		} finally{
			conn.releaseConnection()
		}
	},

	crearRegistro: async (req, res)=>{
		//console.log(req.file)
		const sql = `INSERT INTO pedidos (codcurso, precio, cantidadhoras) VALUES (?,?,?);`
		const creado = await conn.query(sql, [req.body.curso, parseFloat(req.body.precio), req.body.cantidadhoras])
		//console.log(creado)
		res.redirect('/listado.html')
	},

	getModificar: async (req, res) =>{
		const [modificar] = await conn.query(`SELECT nromov, codcurso, precio, cantidadhoras FROM pedidos WHERE nromov=?`, req.params.num)
		console.log(modificar)
		res.render('modificar', {
			title: 'Modifico',
			registro: modificar[0]
		})
	},

	actualizar: async (req, res)=>{
		const sql = `UPDATE pedidos SET codcurso = ?, precio = ?, cantidadhoras = ? WHERE nromov = ?`
		const {idActualizar, codcurso_actualizar, precio, cantidadhoras} = req.body
		const modificado = await conn.query(sql, [codcurso_actualizar, precio, cantidadhoras, idActualizar])
		console.log(modificado)
		res.redirect('/listado.html')
		//res.send(`<h2>Se hizo algo con ${req.body.actualizar} en el update</h2><a href="/dinamic/1">Regresar a la página anterior</a>`)
	},

	eliminar: async (req, res)=>{
		const eliminado = await conn.query(`DELETE FROM pedidos WHERE nromov=?`, req.body.idEliminar)
		res.redirect('/listado.html')
		//res.send(`<h2>Se hizo algo con ${req.body.eliminar} en el delete</h2><a href="/dinamic/1">Regresar a la página anterior</a>`)
	},

}