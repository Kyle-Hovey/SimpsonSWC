var express = require('express');
var cnn = require('../controllers/CNNController');
var router = express.Router();

router.get('/', cnn.index);

router.get('/newarticle', cnn.newArticle);

router.post('/postarticle', cnn.postArticle)

module.exports = router;