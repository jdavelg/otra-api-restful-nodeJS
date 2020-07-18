'use strict'

const { response} = require("express");
var  validator  = require("validator");
var User= require('../models/user')
var bcrypt= require('bcrypt-nodejs')

var jwt= require('../services/jwt')

var fs= require('fs')
var path= require('path')
var controller={

    probando: function(req, res){
return res.status(200).send({
    message: "soy carbonero que vengo de la cumbres del volcan"
});
    },
    testeando:function(req, res){
return res.status(201).send({
    message: "abecedeefegeacheijotakaelemeeseteuvedobleveequisyeseta"
})
    },

    save:function(req, res){
//recoger los parametros de la peticion

var params= req.body;

try {
   //validar los datos
var validate_name= !validator.isEmpty(params.name);
var validate_surname= !validator.isEmpty(params.surname);
var validate_email= validator.isEmail(params.email) && !validator.isEmpty(params.email);
var validate_password=!validator.isEmpty(params.password); 
} catch (error) {
    return res.status(500).send({
        message: "Faltan algunos datos..."
    })
}



//crear el objeto de usuario
if (validate_email && validate_name && validate_password && validate_surname) {
   
    //asignar valores al objeto de usuario
var user= new User();
user.name= params.name;
user.surname=params.surname;
user.email=params.email.toLowerCase();
user.role= "ROLE_USER";
user.image= null

//comprobar si usuario existe
User.findOne({email: user.email}, (err, issetUser)=>{
    if(err) {
        return res.status(500).send({
        message: "Error al comprobar la duplicidad usuario"
    }) }
    if(!issetUser){
//cifrar la contraseña
bcrypt.hash(params.password, null, null, (err, hash)=>{
    user.password= hash   
    //Guardar usuario
user.save((err, userStored)=>{
    if(err) {
        return res.status(500).send({
        message: "Error al comprobar al intentar guardar usuario"
    }) }
    if(!userStored) {
        return res.status(400).send({
        message: "No se puedo guardar usuario"
    }) }
    return res.status(200).send({
        status: "success",
        user: userStored})

})//close save

})//close bcrypt


    }else{
        return res.status(2500).send({
            message: "El usuario ya esta registrado"
        })
    }
})



}else{
    return res.status(200).send({
        message: "error, la validacion fue incorrecta, intentalo de nuevo"
    }) 
}


    },
    login:function(req, res){
//recoger los parametros de la peticion

var params= req.body;

try {
    //validar datos
var validate_email=validator.isEmail(params.email) && !validator.isEmpty(params.email);
var validate_password=!validator.isEmpty(params.password);
    
} catch (error) {
    return res.status(200).send({
        message: "error, faltan algunos datos"
    }) 
}

if( validate_email && validate_password){

//buscar usuario que coincida con el email
User.findOne({email: params.email.toLowerCase()}, (err, user)=>{

    if(err){
        return res.status(500).send({
            message: "error al iniciar sesion"
        }) 
    }
    if(!user){
        return res.status(404).send({
            message: "No se encontro el usuario en la base de datos"
        }) 
    }
    
    //si encuentra el usuario en la db 

//comprobar contraseña
bcrypt.compare(params.password, user.password, (err, check)=>{

    
    if (check) {
        
        
//generar token de jwt y devolverlo
if(params.gettoken){
    return res.status(200).send({
       token: jwt.createToken(user)
    })

}else{
//limpiar el objeto antes de devolverlo
user.password=undefined

//si credenciales coinciden devolver los datos

return res.status(200).send({
    status: "success",
    user
})

}
    }else{
        return res.status(200).send({
            message: "Usuario o contraseña incorrectos"
        })    
    }
})

})

}else{
    return res.status(400).send({
        message: "Usuario o contraseña incorrectos"
    }) 
}

    },

  update: function(req, res){

//recoger los datos del usuario
var params= req.body;

try {
  //validar datos
var validate_name= !validator.isEmpty(params.name);
var validate_surname= !validator.isEmpty(params.surname);
var validate_email= validator.isEmail(params.email) && !validator.isEmpty(params.email);  
} catch (error) {
    return res.status(404).send({
        message:"faltan algunos datos"
        
    }) 
}



//limpiar propiedades innecesarias
delete params.password;

//comprobar si el e-mail es unico
if(req.user.email != params.email){
    User.findOne({email: User.email}, (err, user)=>{       
        
        
        
        if(err) {
            return res.status(500).send({
            message: "Error al comprobar la duplicidad de correo"
        }) }


        if(user) {

            if ( user.email ==  params.email) {
                return res.status(200).send({
                    message: "El email no puede ser modificado"
                })  
            }else{
//buscar y actualizar documentos de la DB
/* User.findOneAndUpdate(condicion, datos a  actualizar, opciones, callback) */

var userId= req.user.sub
User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated)=>{
   if(err){
    return res.status(200).send({
        message:"No se pudo actualizar el usuario",
        status:"error"
    })
   }
   if(!userUpdated){
    return res.status(200).send({
        message:"No se pudo actualizar el usuario",
        status:"error"
    })  
   }
   
    return res.status(200).send({
        status:"success",
        user: userUpdated
    })

});
            }
            
           }        
})

}

  } ,

uploadAvatar:function(req, res){

//configurar el modulo multiparty-> realizado en routes de user

//recoger el fichero de la peticion
var file_name= 'avatar no subido...';

if (!req.files) {

    return res.status(404).send({
        status:"error",
        message:file_name
    })
}
    
    //conseguir el nombre y la extension del archivo subido
    var file_path= req.files.file0.path;
   var file_split= file_path.split('\\');  //** advertencia en Linux o MaC es distinto */


    //nombre del archivo
    file_name= file_split[2];

    //extension del archivo
    var ext_split= file_name.split('\.');

    var file_ext= ext_split[1];

    

//comprobar extension, si no es valida borrar fichero subido

if(file_ext != 'png' && file_ext !='jpg' && file_ext != 'gif' && file_ext !='jpeg' ){

fs.unlink(file_path, (err)=>{

    return res.status(200).send({
        status: "error",
        message:"La extension del archivo no es valida",
        
    })

})

}else{

//comprobar que el usuario esta identificado-sacar id

var userId= req.user.sub
// buscar y efectuar update
User.findOneAndUpdate({_id: userId}, {image: file_name}, {new:true}, (err, userUpdated)=>{

if(err || !userUpdated){
    return res.status(500).send({
        status: "error",
        message:"Error al guardar el avatar",
      
    })
}


    return res.status(200).send({
        status: "success",
        message:"Upload avatar",
        user: userUpdated
    })

})

}

},

avatar: function(req, res){
var fileName= req.params.fileName
var pathFile='./uploads/users/'+fileName;

fs.exists(pathFile, (exists)=>{

    if (exists) {
    return   res.sendFile(path.resolve(pathFile))
        
    }else{
        return res.status(404).send({
            message: 'la imagen no existe'
        });
    }

})

},


getUsers: function(req, res){
User.find().exec((err, users)=>{
    if(err || !users){
        return res.status(404).send({
            status:"error",
            message:"No hay usuarios que mostrar"
        })
    }

    return res.status(200).send({
        status:"success",
        users
    })
})

},

getUser:function(req, res){
var userId= req.params.userId;

User.findById(userId).exec((err, user)=>{
    if(err || !user){
        return res.status(404).send({
            status:"error",
            message:"No existe el usuario"
        })
    }

    return res.status(200).send({
        status:"success",
        user
    })

})
},


}

module.exports= controller;