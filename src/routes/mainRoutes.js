const express = require('express')
const router = express.Router()
const controladores = require(`../controllers/mainController`)
const multer = require('multer')
const path = require('path')
const auth = require('./../config/auth')

const storage = multer.diskStorage({
	destination: (req, file, cb) =>{cb(null, `public/img/`)},
	filename: (req, file, cb) =>{cb(null, Date.now() + "_" + file.originalname)}
})

const uploadFile = multer({storage})

router.get("/listado", auth, controladores.getListado)
router.post('/listado', uploadFile.single('archivo'), controladores.crearRegistro)
/*router.get('/modificar/:num', controladores.getModificar)*/
router.get('/modificar/:num', mainController.getModificar);
router.patch('/modificar', controladores.actualizar)
router.delete('/listado', controladores.eliminar)

module.exports = router