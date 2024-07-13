const { conn } = require('../db/dbconnect.js')
const jwt = require('jsonwebtoken')
const crypt = require('bcryptjs')
const jwtconfig = require('./../config/jwtconfig.js')

module.exports= {
	crearRegistro: async (req, res) =>{
		const {user, password} = req.body
		const enctriptado = await crypt.hash(password, 8)
		const [creado] = await conn.query(`INSERT INTO users (user, password) VALUES (?,?);`,
			[user, enctriptado])
		res.redirect('/login.html')
	},
	login: async (req, res) =>{
		const {user, password} = req.body
		const [[valido]] = await conn.query(`SELECT * FROM users WHERE user = ?`, user)
		if(valido === undefined){
			res.status(404).send('Usuario no encontrado')
		} else if(!(await crypt.compare(password, valido.password))){
			res.status(401).send({auth: false, token: null})
		} else {
			const token = jwt.sign({id: valido.id}, jwtconfig.secretKey, {expiresIn: jwtconfig.tokenExpiresIn})
			res.status(201).send({auth: true, token})
		}
	},
	logout: async (req, res) =>{

	},
}