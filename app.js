'use strict'

//requires
 const express = require('express')
const bodyParser = require('body-parser')

//ejecutar express
const app = express()
/* const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`)) */


//cargar archivos de rutas
var user_routes= require('./routes/user')
var topic_routes= require('./routes/topic')
var comment_routes= require('./routes/comment')

//agregar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//configurar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//reescribir rutas
app.use('/api', user_routes)
app.use('/api', topic_routes)
app.use('/api', comment_routes)

//RUTA/metodo de prueba
app.get('/prueba', (req, res)=>{
return res.status(200).send({
    message: 'hola mundo desde el backend con node',
    nombre:'jonathan lopez'
})
})



//Exportar el modulo
module.exports=app;