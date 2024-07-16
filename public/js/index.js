/* ***SERVER ESTÁTICO CON EXPRESS (Módulo Externo)*** */
const express = require(`express`)
const override = require('method-override')
const rutas = require('./src/routes/mainRoutes.js')
const rutasLogin = require('./src/routes/loginRoutes.js')
const app = express()

const port = 8080 || process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', (__dirname + '/src/views'))

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(override('_metodo'))

app.use('/login', rutasLogin)
app.use('/', rutas)

//app.use('/admin', rutasAdmin) // /admin/loquesea /admin/xyz

app.use((req, res, next) =>{
	res.status(404).send(`<h1 style="color: red">Recurso no encontrado!</h1>`)
})
app.listen(port, () => console.log(`Hola, estoy ready en el puerto: ${port}`))
