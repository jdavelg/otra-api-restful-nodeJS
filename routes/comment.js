'use strict'


const express = require('express')
const router = express.Router()
var CommentController= require('../controllers/comment')
var md_auth= require('../middlewares/authenticate')



router.post('/comment/topic/:topicId', md_auth.authenticate, CommentController.add);
router.put('/comment/:commentId', md_auth.authenticate, CommentController.update);
router.delete('/comment/:topicId/:commentId', md_auth.authenticate, CommentController.delete);

module.exports= router;