var express = require('express');
var messenger = require('../controllers/MessageController')
var router = express.Router();

router.get('/', messenger.index);

router.get('/newmessage', messenger.newMessage);

router.post('/newmessage', messenger.sendMessage);

module.exports = router;