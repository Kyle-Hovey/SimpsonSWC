var express = require('express');
var system = require('../controllers/SystemController');
var character = require('../controllers/CharacterController');
var router = express.Router();

//get the directory home page
router.get('/', system.directoryHome);

//edit system page
router.get('/systemeditor:id', system.editor);

//get system creator page
router.get('/systemcreator', system.creator);

//get specific system page
router.get('/system:id', system.system);

//get crisis creator
router.get('/crisiscreator:id', system.crisisCreator);

//post system page
router.post('/createsystem', system.create);

//post edit existing system
router.post('/editsystem:id', system.edit);

//post new crisis
router.post('/createcrisis:id', system.createCrisis);

//get crisis editor
router.get('/crisiseditor/:id/:crisis', system.crisisEditor);

//post edit existing system
router.post('/editcrisis/:id/:crisis', system.editCrisis);

//get character creator
router.get('/charactercreator', character.creator);

//edit character
router.get('/charactereditor:id', character.editor);

//get all characters
router.get('/characters', character.characters);

//get specific character page
router.get('/character:id', character.character);

//post new character page
router.post('/createcharacter', character.create);

//post edit existing character
router.post('/editcharacter:id', character.edit);

module.exports = router;