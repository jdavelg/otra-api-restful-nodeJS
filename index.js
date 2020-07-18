'use strict'

var mongoose = require('mongoose');
var app= require('./app')
var port= process.env.PORT || 3999


mongoose.set('useFindAndModify', false)
mongoose.Promise= global.Promise;
{ useUnifiedTopology: true }
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser:true })
.then(()=>{
    console.log("la conexion a la BD de mongo de ha realizado correctamente");
//crear el servidor

app.listen(port, ()=>{
    console.log("el servidor is running good");
    
})


    
}).catch(error=>console.log(error));

