'use strict'

var  mongoose  = require("mongoose");
var Schema  = mongoose.Schema;

var UserSchema= Schema({

    name: String,
    surname: String,
    email:String,
    password:String,
    image:String,
    role:String
});

UserSchema.methods.toJSON= function(){
var obj= this.toObject();
delete obj.password;


return obj


}

module.exports= mongoose.model('User', UserSchema)
//esto hara un lowercase y va a crear coleccion "users" ( es decir pluralizar el nombre)
//dentro de la coleccion que creara habran muchos documentos con el UserSchema

