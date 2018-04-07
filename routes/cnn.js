var express = require('express');
var cnn = require('../controllers/CNNController');
var router = express.Router();

router.get('/', cnn.index);

router.get('/article:id', cnn.getArticle);

router.get('/newarticle', cnn.newArticle);

router.post('/postarticle', cnn.postArticle);

module.exports = router;