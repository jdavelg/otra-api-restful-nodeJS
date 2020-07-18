'use strict'

var validator = require('validator')
var Topic = require('../models/topic')



var controller = {


    test: function (req, res) {
        return res.status(200).send({
            message: "topic controller working"
        })
    },


    save: function (req, res) {

        //Recoger Parametros por Post
        var params = req.body;

        //validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);


        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar"
            })
        }

        //crear objeto a guardar

        if (validate_content && validate_title && validate_lang) {

            //crear objeto a guardar
            var topic = new Topic();

            //asignar valores
            topic.title = params.title
            topic.content = params.content
            topic.code = params.code
            topic.lang = params.lang
            topic.user= req.user.sub

            //guardar el topic
            topic.save((err, topicStored) => {

                if(err|| !topicStored){
                    return res.status(404).send({
                        status: "error",
                        message: "No se pudo guardar",
                       
                    })  
                }

                //devolver una response

                return res.status(200).send({
                    status: "success",
                    message: "Guardado correctamente",
                    topic: topicStored
                })
            })



        } else {

            return res.status(200).send({
                message: "No se han enviado los datos validos"
            })
        }

    },

    getTopics:function(req, res){

      //cargar la libreria de paginacion en la clase(MODELO)

//recoger la pagina actual
if (!req.params.page || req.params.page==null || req.params.page==undefined || req.params.page==0 || req.params.page=="0"  ) {
    var page= 1
}else{
    var page= parseInt(req.params.page)
}
      //indicar las opciones de paginacion
var options={
    sort:{ date: -1},
    populate: 'user',
    limit: 5,
    page: page
}


      //Find paginado
      Topic.paginate( {}, options, (err, topics)=>{

if (err || !topics) {
    return res.status(500).send({
        status:'error',
        message:"error al obtener los topics"
      })     
}


          //return resultados (topics, total topics y total de paginas)

          return res.status(200).send({
          status:'success',
          topics:topics.docs,
          totalDocs:topics.totalDocs,
          totalPages:topics.totalPages
        })  
      })    
    },


    getTopicsByUser: function(req, res){
//conseguir el id del usuario
var userId= req.params.user

//hacer un find con la condicion de usuario
Topic.find({
    user: userId
})
.sort([['date', 'descending']])
.exec((err, topics)=>{
if (!topics || err) {
    return res.status(500).send({
        status:'error',
        message:"Error al conseguir topics del user"
      })    
}
//devolver un resultado
return res.status(200).send({
    status:'success',
    message:"exito",
    topics
  })  




})
    
    },

    getTopic: function(req, res){
       //sacar el id del topic de la url
var topicId= req.params.id

       //find del id del topic
Topic.findById(topicId)
.populate('user').populate('comments.user')

.exec((err, topic)=>{
    if (!topic || err) {
        return res.status(500).send({
            status:'error',
            message:"Error en la peticion"
          })    
    }
    //devolver un resultado
    return res.status(200).send({
        status:'success',
        message:"exito al recuperar el documento",
        topic
      })  
})        
    
    },

    update:function(req, res){

        //recoger el id del topic de la url
var topicId= req.params.id

        //recoger los datos desde post

        var params= req.body

        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);


        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar"
            })
        }


        if (validate_content && validate_title && validate_lang) {
             //montar json con los datos a modificar
        var update={
            title: params.title,
            content:params.content,
            code:params.code,
            lang:params.lang
        }

        //finand update del topic por id y por userId
Topic.findOneAndUpdate({_id:topicId, user:req.user.sub}, update, {new:true}, (err, topicUpdated)=>{
 
    if (!topicUpdated || err) {
        return res.status(500).send({
            status:'error',
            message:"Error en la peticion"
          })    
    }
 
    //devolver una response
  return res.status(200).send({
    status:'success',
    message:"exito al actualizar el documento",      
    topic:topicUpdated     
  }) 

})

       
    } else{
        return res.status(200).send({
            status:'error',
            message:"Enviaste datos invalidos",           
          })  
    }
        },

      delete: function(req, res){
//sacar el id del topic de la URL

var topicId= req.params.id
//find and delete por topic id y por user id

Topic.findOneAndDelete({_id:topicId, user: req.user.sub}, (err, topicRemoved)=>{

    if (!topicRemoved || err) {
        return res.status(500).send({
            status:'error',
            message:"Error en la peticion"
          })    
    }
 
    //devolver una response
  return res.status(200).send({
    status:'success',
    message:"exito al realizar borrado", 
    topic: topicRemoved          
  })  
})

      } , 
    
      search: function(req, res){

//sacar string a buscar de la URL
var searchString= req.params.search;

//find or
Topic.find({
    "$or":[
       {"title": {"$regex": searchString, "$options": "i"} }, 
       {"content": {"$regex": searchString, "$options": "i"} }, 
       {"tilangtle": {"$regex": searchString, "$options": "i"} }, 
       {"code": {"$regex": searchString, "$options": "i"} }, 
    ]
}).populate('user').sort([['date','descending']])
.exec((err, topics)=>{

    if(err){
        return res.status(500).send({
            status:"error",
            message:"error en la peticion "
        })
    }

    if(!topics){
        return res.status(500).send({
            status:"error",
            message:"No hay contenido de acuerdo a la busqueda"
        })
    }


//devolver result

return res. status(200).send({
    message:"exito",
    topics
})
})

      }

}

module.exports = controller