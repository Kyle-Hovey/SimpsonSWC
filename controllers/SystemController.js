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
	if (req.user){
		System.findOne({_id : req.params.id}).populate('patrons').populate('proxies').exec(function(err, system){
			if(err) {
				console.log(err);
				res.redirect(backURL, {message : err.message});
			} else {
				Character.find({characterType : 'patron'}, function(err, patrons) {
					if (err) {
						console.log(err);
					} else {
						Character.find({characterType : 'proxy'}, function(err, proxies) {
							if (err) {
								console.log(err)
							} else {
								res.render('systemeditor', {user : req.user, system : system,patrons : patrons, proxies : proxies});
							}
						});
					}
				});
			}
		})
	}
};

systemController.edit = function(req, res) {
	
	System.findById(req.params.id, function(err, system) {
		system.patrons = [];
		system.proxies = [];
		if (Array.isArray(req.body.patrons)) {
			for(var i = 0, len = req.body.patrons.length; i < len; i++) {
				system.patrons.push(req.body.patrons[i]);
			}
		} else {
			system.patrons.push(req.body.patrons);
		}
		if (Array.isArray(req.body.proxies)) {
			for(var i = 0, len = req.body.proxies.length; i < len; i++) {
				system.proxies.push(req.body.proxies[i]);
			}
		} else {
			system.proxies.push(req.body.proxies);
		}
		system.name = req.body.name;
		system.crisis = req.body.crisis;
		system.history = req.body.history;
		system.owner = req.user._id;
		system.save(function(err, system) {
			if (err) {
				console.log(err);
			}
			else {
				console.log(system);
				res.redirect('system' + system._id);
			}
		})
	});

};

module.exports = systemController;