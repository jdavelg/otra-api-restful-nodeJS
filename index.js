'use strict'

var mongoose = require('mongoose');
var app= require('./app')
var port= process.env.PORT || 3999


mongoose.set('useFindAndModify', false)
mongoose.Promise= global.Promise;
{ useUnifiedTopology: true }
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/api_rest_node', { useNewUrlParser:true, useUnifiedTopology: true })
.then(()=>{
    console.log("la conexion a la BD de mongo de ha realizado correctamente");
//crear el servidor
app.listen(process.env.PORT || 8080
    
    )


    
}).catch(error=>console.log(error));

