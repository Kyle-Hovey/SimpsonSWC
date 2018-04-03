var express = require('express');
var Character = require('../models/character');
var System = require('../models/system');
var characterController = {};

characterController.character = function (req, res) {
	Character.findOne({_id : req.params.id}).populate('homesystem').populate('contact').exec(function(err, character){
		if (err) {
			console.log(err);
		} else {
			res.render('character', {character : character});
		}
	});
};

characterController.creator = function (req, res) {

	System.find(function(err, systems) {
		if (err) {
			console.log(err);
		} else {
			Character.find({characterType : 'patron'}, function(err, patrons) {
				if (err) {
					console.log(err);
				} else {
					Character.find({characterType : 'proxy'}, function(err, proxies) {
						if (err) {
							console.log(err)
						} else {
							res.render('charactercreator', {user : req.user, systems : systems, patrons : patrons, proxies : proxies});
						}
					});
				}
			});
		}
	});
};

characterController.create = function (req, res) {
	var newCharacter = new Character;
	if (Array.isArray(req.body.skills)){
		for(var i = 0, len = req.body.skills.length; i < len; i++) {
		newCharacter.skills.push(req.body.skills[i]);
		}
	}
	else {
		newCharacter.skills.push(req.body.skills);
	}
	if (Array.isArray(req.body.special)){
		for(var i = 0, len = req.body.special.length; i < len; i++) {
		newCharacter.special.push(req.body.special[i]);
		}
	}
	else {
		newCharacter.special.push(req.body.special);
	}
	var skills = req.body.skills;
	var special = req.body.special;
	newCharacter.name = req.body.name;
	newCharacter.occupation = req.body.occupation;
	newCharacter.species = req.body.species;
	newCharacter.characterType = req.body.charactertype;
	if (req.body.charactertype == 'proxy') {
		newCharacter.contact = req.body.patroncontact;
	}
	if (req.body.charactertype == 'patron') {
		newCharacter.contact = req.body.proxycontact;
	}
	newCharacter.homesystem = req.body.system;
	newCharacter.backstory = req.body.backstory;
	newCharacter.motives = req.body.motives;
	newCharacter.save(function(err, newCharacter){
		if (err) {
			console.log(err);
		}
		else{
			console.log(newCharacter);
			res.redirect('character' + newCharacter._id);
		}
	});
};

characterController.editor = function(req, res) {
	Character.findOne({_id : req.params.id}).populate('homesystem').populate('contact').exec(function(err, character) {
		if (err) {
			console.log(err)
			res.redirect('character', {message : err.message});
		} else {
			System.find(function(err, systems){
				if (err) {
					console.log(err);
				} else {
					Character.find({characterType : 'patron'}, function(err, patrons) {
						if (err) {
							console.log(err);
						} else {
							Character.find({characterType : 'proxy'}, function (err, proxies) {
								if (err) {
									console.log(err);
								} else {
									res.render('charactereditor', {user : req.user, character : character, proxies : proxies, patrons : patrons, systems : systems});
								}
							})
						}
					})
				}
			});
		}
	});
};

characterController.edit = function(req, res) {
	
	Character.findById(req.params.id, function(err, character) {
		character.skills = [];
		character.special = [];
		if (Array.isArray(req.body.skills)){
			for(var i = 0, len = req.body.skills.length; i < len; i++) {
			character.skills.push(req.body.skills[i]);
			}
		}
		else {
			character.skills.push(req.body.skills);
		}
		if (Array.isArray(req.body.special)){
			for(var i = 0, len = req.body.special.length; i < len; i++) {
			character.special.push(req.body.special[i]);
			}
		}
		else {
			character.special.push(req.body.special);
		}
		var skills = req.body.skills;
		var special = req.body.special;
		character.name = req.body.name;
		character.occupation = req.body.occupation;
		character.species = req.body.species;
		character.characterType = req.body.charactertype;
		if (req.body.charactertype == 'proxy') {
			character.contact = req.body.patroncontact;
		}
		if (req.body.charactertype == 'patron') {
			character.contact = req.body.proxycontact;
		}
		character.homesystem = req.body.system;
		character.backstory = req.body.backstory;
		character.motives = req.body.motives;
		character.save(function(err, newCharacter){
			if (err) {
				console.log(err);
			}
			else{
				console.log(newCharacter);
				res.redirect('character' + character._id)
			}
		});
	});
};


module.exports = characterController;