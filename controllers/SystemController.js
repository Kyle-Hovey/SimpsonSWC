var express = require('express');
var System = require('../models/system');
var Character = require('../models/character');
var Account = require('../models/account');

var systemController = {};

systemController.directoryHome = function(req, res) {
	System.find().populate('patrons').populate('proxies').exec(function(err, systems) {
		if (err) {
			console.log(err);
		} else {
			Character.find({characterType : 'wildcard'}, function(err, wildcards) {
				if (err) {
					console.log(err);
				} else {
					res.render('directory', {systems : systems, wildcards : wildcards});
				}
			});
		}
	});
};

systemController.index = function (req, res) {
	System.find(function(err, systems) {
		var systemList = {};

		systems.forEach(function(system) {
			systemList[system._systemId] = system;
		});

		res.send(systemList);
	});
};

systemController.system = function (req, res) {
	System.findOne({_id : req.params.id}).populate('patrons').populate('proxies').exec(function(err, system){
			if (err) {
				console.log(err);
			} else {
				//res.send(system)
				res.render('system', {system : system});
			}
	});
};

systemController.creator = function (req, res) {
	Character.find({characterType : 'patron'}, function(err, patrons) {
		if (err) {
			console.log(err);
		} else {
			Character.find({characterType : 'proxy'}, function(err, proxies) {
				if (err) {
					console.log(err)
				} else {
					res.render('systemcreator', {user : req.user, patrons : patrons, proxies : proxies});
				}
			});
		}
	});
};

systemController.create = function (req, res) {
	
	var newSystem = new System;
	if (Array.isArray(req.body.patrons)) {
		for(var i = 0, len = req.body.patrons.length; i < len; i++) {
			newSystem.patrons.push(req.body.patrons[i]);
		}
	} else {
		newSystem.patrons.push(req.body.patrons);
	}
	if (Array.isArray(req.body.proxies)) {
		for(var i = 0, len = req.body.proxies.length; i < len; i++) {
			newSystem.proxies.push(req.body.proxies[i]);
		}
	} else {
		newSystem.proxies.push(req.body.proxies);
	}
	newSystem.name = req.body.name;
	newSystem.crisis = req.body.crisis;
	newSystem.history = req.body.history;
	newSystem.owner = req.user._id;
	newSystem.save(function(err, newSystem){
		if (err) {
			console.log(err);
		} else {
			console.log(newSystem);
			res.redirect('system' + newSystem._id);
		}
	});
};

systemController.editor = function(req, res) {
	res.send('System Editor');
};

systemController.edit = function(req, res) {
	res.send('Edit System');
};
/*
	var patronIds = new Array();
	var patrons = req.body.patrons.split(",");
	patrons.forEach(function(patron){
		patron.trim();
		Character.findOrCreate(patron, "patron", function(err, patron){
			patronIds.push(patron._id);
		});
	});

	res.send(patronIds.toString());


	
	//Find or create patrons listed by creator
	var patrons = new Array();
	patrons = req.body.patrons.split(",");
	var patronIds = new Array();

	patrons.forEach(function(patron) {
		patron = patron.trim();
				console.log('handling ' + patron);
				Character.findOne({name : patron}, function(err, character) {
					if (err) {
						console.log(err);
						res.send(err.message);
					} else if (character) {
						console.log('For Character: ' + character.name + 'added character id: ' + character._id);
						patronIds.push(character._id);
					} else {
						console.log('Creating new character named ' + patron);
						var newCharacter = new Character({name : patron, characterType : 'patron'});
						newCharacter.save(function(err, newCharacter){
							if (err) {
								console.log(err);
								return res.send(err.message);
							} else {
								console.log(newCharacter + ' has been created.');
								Character.findOne({name : patron}, function(err, character) {
									if (err){
										return console.log(err);
									} else {
										patronIds.push(character._id);
									}
								});
							}
						});
					}
				});
	});

	console.log(patronIds.toString());

	var proxies = new Array();
	proxies = req.body.proxies.split(",");
	var proxyIds = new Array();
	
	proxies.forEach(function(proxy) {
		proxy = proxy.trim();
				console.log('handling ' + proxy);
				Character.findOne({name : proxy}, function(err, character) {
					if (err) {
						console.log(err);
						res.send(err.message);
					} else if (character) {
						console.log('For Character: ' + character.name + 'added character id: ' + character._id);
						proxyIds.push(character._id);
					} else {
						console.log('Creating new character named ' + proxy);
						var newCharacter = new Character({name : proxy, characterType : 'proxy'});
						newCharacter.save(function(err, newCharacter){
							if (err) {
								console.log(err);
								return res.send(err.message);
							} else {
								console.log(newCharacter + ' has been created.');
								Character.findOne({name : proxy}, function(err, character) {
									if (err){
										return console.log(err);
									} else {
										proxyIds.push(character._id);
									}
								});
							}
						});
					}
				});
	});

	console.log(proxyIds.toString());

	

function findOrCreateCharacters(characters) {
	characters.forEach(function(character){
		Character.findOne({name : character}, function(err, character) {
			if (err) {
				console.log(err);
				return res.send(err.message);
			}
		});
	})
}

function listCharacters(characters) {
	var characterIds = new Array();

	character.forEach(function(character) {
		character = character.trim();
				console.log('handling ' + character);
				Character.findOne({name : character}, function(err, character) {
					if (err) {
						console.log(err);
						res.send(err.message);
					} else if (character) {
						console.log('For Character: ' + character.name + 'added character id: ' + character._id);
						patronIds.push(character._id);
					} else {
						console.log('Creating new character named ' + patron);
						var newCharacter = new Character({name : patron, characterType : 'patron'});
						newCharacter.save(function(err, newCharacter){
							if (err) {
								console.log(err);
								return res.send(err.message);
							} else {
								console.log(newCharacter + ' has been created.');
								Character.findOne({name : patron}, function(err, character) {
									if (err){
										return console.log(err);
									} else {
										patronIds.push(character._id);
									}
								});
							}
						});
					}
				});
				*/

module.exports = systemController;