var express = require('express');
var Character = require('../models/character');
var System = require('../models/system');
var Account = require('../models/account');
var characterController = {};

characterController.characters = function(req, res){
	if (req.user) {
		Account.findById(req.user.id).populate('roles').exec(function(err, account) {
			Character.find({characterType : 'patron'}).exec(function(err, patrons){
				Character.find({characterType : 'proxy'}).exec(function(err, proxies){
					Character.find({characterType: 'wildcard'}).exec(function(err, wildcards){
						res.render('characters', {user : account, patrons : patrons, proxies: proxies, wildcards: wildcards});
					});
				});
			});
		});
	} else {
		Character.find({characterType : 'patron'}).exec(function(err, patrons){
			Character.find({characterType : 'proxy'}).exec(function(err, proxies){
				Character.find({characterType: 'wildcard'}).exec(function(err, wildcards){
					res.render('characters', {user : req.user, patrons : patrons, proxies: proxies, wildcards: wildcards});
				});
			});
		});
	}
};

characterController.character = function (req, res) {
	if (req.user) {
		Account.findById(req.user.id).populate('roles').exec(function(err, account) {
			Character.findOne({_id : req.params.id}).populate('contact').exec(function(err, character){
				if (err) {
					console.log(err);
				} else {
					res.render('character', {user : account, character : character});
				}
			});
		});
	} else	{
		Character.findOne({_id : req.params.id}).populate('contact').exec(function(err, character){
			if (err) {
				console.log(err);
			} else {
				res.render('character', {user : req.user, character : character});
			}
		});
	}
};

characterController.creator = function (req, res) {
	if (req.user) {
		Account.findById(req.user.id).populate('roles').exec(function(err, account) {
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
									res.render('charactercreator', {user : account, systems : systems, patrons : patrons, proxies : proxies});
								}
							});
						}
					});
				}
			});
		});
	} else {
		res.redirect('../login');
	}
};

characterController.create = function (req, res) {
	var newCharacter = new Character;
	console.log(req.body.skills);
	console.log(req.body.special);	
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
	newCharacter.quirks = req.body.quirks;
	newCharacter.characterType = req.body.charactertype;
	if (req.body.charactertype == 'proxy') {
		newCharacter.contact = req.body.patroncontact;
	}
	if (req.body.charactertype == 'patron') {
		newCharacter.contact = req.body.proxycontact;
	}
	newCharacter.homesystem = req.body.system.toString().replace(",", "");
	newCharacter.backstory = req.body.backstory;
	newCharacter.shortterm = req.body.shortterm;
	newCharacter.longterm = req.body.longterm;
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
	backURL = req.header('Referer') || '/';

	if (req.user){
		Account.findById(req.user.id).populate('roles').exec(function(err, account) {
			Character.findOne({_id : req.params.id}).populate('contact').exec(function(err, character) {
				if (err) {
					console.log(err)
					res.redirect(backURL, {message : err.message});
				} else {
					System.find(function(err, systems){
						if (err) {
							console.log(err);
							res.redirect(backURL, {message : err.message});
						} else {
							Character.find({characterType : 'patron'}, function(err, patrons) {
								if (err) {
									console.log(err);
									res.redirect(backURL, {message : err.message});
								} else {
									Character.find({characterType : 'proxy'}, function (err, proxies) {
										if (err) {
											console.log(err);
											res.redirect(backURL, {message : err.message});
										} else {
											res.render('charactereditor', {user : account, character : character, proxies : proxies, patrons : patrons, systems : systems});
										}
									})
								}
							})
						}
					});
				}
			});
		});
	} else {
		res.redirect('../login')
	}
};

characterController.edit = function(req, res) {
	
	Character.findById(req.params.id, function(err, character) {
		character.skills = [];
		character.special = [];
		console.log(req.body.skills);
		console.log(req.body.special);
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
		character.quirks = req.body.quirks;
		character.characterType = req.body.charactertype;
		if (req.body.charactertype == 'proxy') {
			character.contact = req.body.patroncontact;
		}
		if (req.body.charactertype == 'patron') {
			character.contact = req.body.proxycontact;
		}
		character.homesystem = req.body.system.toString().replace(",", "");
		character.backstory = req.body.backstory;
		character.shortterm = req.body.shortterm;
		character.longterm = req.body.longterm;
		character.save(function(err, newCharacter){
			if (err) {
				console.log(err);
			}
			else{
				console.log(newCharacter);
				res.redirect('character' + character._id);
			}
		});
	});
};


module.exports = characterController;