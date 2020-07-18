'use strict'

var Topic = require('../models/topic')
var validator = require('validator')

var controller = {

    add: function (req, res) {
        //recoger id del topic por la url

        var topicId = req.params.topicId

        //find por el id del topic
        Topic.findById(topicId).exec((err, topic) => {
            if (err || !topic) {
                return res.status(500).send({
                    status: "error",
                    message: "error en la peticion"
                })
            }

            //dentro de la propiedad comments del objeto resultante hacer un push
            if (req.body.content) {
                //validar datos
                try {
                    var validate_content = !validator.isEmpty(req.body.content);
                } catch (error) {
                    return res.status(200).send({
                        message: "No has enviado datos validos"
                    })
                }
                if (validate_content) {
                    //comprobar usuario y validar datos
                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    }
                    //hacer un push
                    topic.comments.push(comment)
                    //save-guardar el comment completo en el topic
                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: "error",
                                message: "error en la peticion"
                            })
                        }







                        //find del id del topic
                        Topic.findById(topic._id)
                            .populate('user').populate('comments.user')

                            .exec((err, topic) => {
                                if (!topic || err) {
                                    return res.status(500).send({
                                        status: 'error',
                                        message: "Error en la peticion"
                                    })
                                }
                                //devolver un resultado
                                return res.status(200).send({
                                    status: 'success',
                                    message: "exito al recuperar el documento",
                                    topic
                                })
                            })

                   


                    })


                } else {
                    return res.status(200).send({
                        message: "No has enviado datos validos"
                    })
                }


            }
        })
    },


    update: function (req, res) {

        //conseguir el id de comentario que llega de la url
        var commentId = req.params.commentId
        //recoger datos que llegan por el body

        var params = req.body

        //validar
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                message: "No has enviado datos validos"
            })
        }

        if (validate_content) {
            //find and update de subdocumento comentario
            Topic.findOneAndUpdate(
                { "comments._id": commentId },
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                { new: true },
                (err, topicUpdated) => {
                    if (err || !topicUpdated) {
                        return res.status(500).send({
                            status: "error",
                            message: "error en la peticion"
                        })
                    }

                    //devolver los datos

                    return res.status(200).send({
                        status: "success",
                        message: "exito al actualizar",
                        topic: topicUpdated
                    })
                }
            )

        }
    },

    delete: function (req, res) {

        //sacar el id del topic y del comentario a borrar
        var topicId = req.params.topicId
        var commentId = req.params.commentId
        //buscar el topic
        Topic.findById(topicId, (err, topic) => {

            if (err || !topic) {
                return res.status(500).send({
                    status: "error",
                    message: "error en la peticion"
                })
            }

            //seleccionar el subdocumento(comentario)
            var comment = topic.comments.id(commentId);

            //borrar el comentario
            if (comment) {
                comment.remove()

                //guardar el topic
                topic.save((err) => {
                    if (err || !topic) {
                        return res.status(500).send({
                            status: "error",
                            message: "error en la peticion"
                        })
                    }
                    //devolver un resultado


                   //find del id del topic
                   Topic.findById(topic._id)
                   .populate('user').populate('comments.user')

                   .exec((err, topic) => {
                       if (!topic || err) {
                           return res.status(500).send({
                               status: 'error',
                               message: "Error en la peticion"
                           })
                       }
                       //devolver un resultado
                       return res.status(200).send({
                           status: 'success',
                           message: "exito al recuperar el documento",
                           topic
                       })
                   })


                })


            } else {
                return res.status(500).send({
                    status: "error",
                    message: "No existe el comentario"
                })
            }

        })


    },




}

module.exports = controller