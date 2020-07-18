'use strict'


const express = require('express')
const router = express.Router()
var TopicController= require('../controllers/topic')
var md_auth= require('../middlewares/authenticate')

router.get('/test', TopicController.test);
router.post('/topic', md_auth.authenticate, TopicController.save);
router.get('/topics/:page?',TopicController.getTopics);
router.get('/user-topics/:user',TopicController.getTopicsByUser);
router.get('/topic/:id',TopicController.getTopic);
router.put('/topic/:id', md_auth.authenticate, TopicController.update);
router.delete('/topic/:id', md_auth.authenticate, TopicController.delete);
router.get('/search/:search',TopicController.search);
module.exports= router
