var express = require('express');
var message = require('../controllers/MessageController');
var router = express.Router();

router.get('/:id', message.index);

router.post('/newchat/:id', message.newChat);

router.get('/chat/:characterid/:chatid', message.getChat);

router.get('/chats', message.getChats);

router.post('/chats', message.chats);

module.exports = router;