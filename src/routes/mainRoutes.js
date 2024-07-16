const express = require('express')
const router = express.Router()
const controladores = require(`../controllers/mainController`)
const auth = require('./../config/auth')

router.get("/listado", auth, controladores.getListado)
router.post('/listado', controladores.crearRegistro) // Removido uploadFile.single('archivo')
router.get('/modificar/:num', controladores.getModificar)
router.patch('/modificar/:id', controladores.actualizar) // Añadido :id
router.get('/modificar/:id', controladores.getModificar);
router.delete('/listado', controladores.eliminar)
router.delete('/listado/:id', controladores.eliminar);
router.put('/modificar/:id', controladores.actualizar)
router.delete('/eliminar/:id', controladores.eliminar)
router.post('/crear', controladores.crearRegistro)

module.exports = router
