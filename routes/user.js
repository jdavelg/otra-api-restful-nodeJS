'use strict'

const express = require('express')
const app = express()
var multipart= require('connect-multiparty')
var md_upload= multipart({ uploadDir: './uploads/users'})

var UserController= require('../controllers/user')
var router  = express.Router()
var md_auth= require('../middlewares/authenticate')

//rutas de prueba
router.get('/probando',UserController.probando);
router.post('/testeando', UserController.testeando)

//rutas de usuarios

router.post('/register', UserController.save)
router.post('/login', UserController.login)
router.put('/user/update',md_auth.authenticate, UserController.update),
router.post('/upload-avatar', [md_auth.authenticate, md_upload], UserController.uploadAvatar)
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports=router;