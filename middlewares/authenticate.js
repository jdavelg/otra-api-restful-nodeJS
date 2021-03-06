'use strict'

var jwt= require('jwt-simple')
var moment= require('moment')
var secret='clave-secreta-para-generar-el-token-9999'



exports.authenticate= function(req, res, next){

//comprobar si llega la cabecera authorization

if(!req.headers.authorization){
    return res.status(404).send({

        message: "No estas autenticado para realizar la accion"
    })
}
//limpiar el token y quitar comillas

var token= req.headers.authorization.replace(/['"]+/g,'');


try {
    //decofidicar token
   var payload= jwt.decode(token,secret) 

   //comprobar si token ha expirado
   if (payload.exp<= moment.unix()) {
    return res.status(404).send({

        message: "El token ha expirado"
    }) 
   }
} catch (error) {
    return res.status(404).send({

        message: "El token no es valido"
    })
}




//adjuntar usuario identificado a request
req.user=payload;

//pasar a la accion

    next();
}

