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
					res.render('directory', {user : req.user, systems : systems, wildcards : wildcards});
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
	backURL = req.header('Referer') || '/';
	System.findOne({_id : req.params.id}).populate('patrons').populate('proxies').exec(function(err, system){
			if (err) {
				console.log(err);
				res.redirect(backURL);
			} else {
				//res.send(system)
				res.render('system', {user : req.user, system : system});
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
	} else if (req.body.patrons !== null) {
		newSystem.patrons.push(req.body.patrons);
	} else {
		newSystem.patrons = [];
	}
	if (Array.isArray(req.body.proxies)) {
		for(var i = 0, len = req.body.proxies.length; i < len; i++) {
			newSystem.proxies.push(req.body.proxies[i]);
		}
	} else if (req.body.proxies !== null) {
		newSystem.proxies.push(req.body.proxies);
	} else {
		newSystem.proxies = [];
	}
	newSystem.name = req.body.name;
	newSystem.overview = req.body.overview;
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
	backURL = req.header('Referer') || '/';
	if (req.user){
		System.findOne({_id : req.params.id}).exec(function(err, system){
			if(err) {
				console.log(err);
				res.redirect(backURL);
			} else {
				Character.find({characterType : 'patron'}, function(err, patrons) {
					if (err) {
						console.log(err);
						res.redirect(backURL);
					} else {
						Character.find({characterType : 'proxy'}, function(err, proxies) {
							if (err) {
								console.log(err);
								res.redirect(backURL);
							} else {
								//res.send(system);
								res.render('systemeditor', {user : req.user, system : system, patrons : patrons, proxies : proxies});
							}
						});
					}
				});
			}
		})
	} else {
		res.redirect(backURL);
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
		} else if (req.body.patrons !== null) {
			system.patrons.push(req.body.patrons);
		} else {
		newSystem.patrons = [];
		}
		if (Array.isArray(req.body.proxies)) {
			for(var i = 0, len = req.body.proxies.length; i < len; i++) {
				system.proxies.push(req.body.proxies[i]);
			}
		} else if (req.body.proxies !== null) {
			system.proxies.push(req.body.proxies);
		} else {
			system.proxies = [];
		}
		system.name = req.body.name;
		system.overview = req.body.overview;
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


systemController.crisisCreator = function(req, res) {
	backURL = req.header('Referer') || '/';
	System.findOne({_id : req.params.id}).exec(function(err, system) {
		if (err) {
			console.log(err);
			res.redirect(backURL);
		} else {
			res.render('crisiscreator', {user : req.user, system : system});
		}
	});

};

systemController.createCrisis = function(req, res) {
	backURL = req.header('Referer') || '/';
	System.findById(req.params.id, function(err, system) {
		if (err) {
			console.log(err);
			req.redirect(backURL);
		} else {
			var crisis = {crisisname : req.body.crisisname, crisisevents : []};
			crisis.crisisname = req.body.crisisname;
			if (Array.isArray(req.body.eventname)) {
				for (var i =0, len = req.body.eventname.length; i < len; i++) {
					var event = {eventtitle : req.body.eventname[i], eventdescription : req.body.eventdescription[i]};
					crisis.crisisevents.push(event);
				} 
			} else {
				var event = {eventtitle : req.body.eventname, eventdescription : req.body.eventdescription};
				crisis.crisisevents.push(event);
			}
			system.crises.push(crisis);
			system.save(function(err, system) {
				if (err) {
					console.log(err);
					res.redirect(backURL);
				} else {
					console.log(system);
					res.redirect('system' + system._id);
				}
			})
		}
	});
};

systemController.crisisEditor = function(req, res) {
	backURL = req.header('Referer') || '/';
	System.findById(req.params.id, function(err, system) {
		if (err) {
			console.log(err);
			req.redirect(backURL);
		} else {
			function findCrisis(crisis) {
				return crisis.crisisname == req.params.crisis;
			}
			var crisis = system.crises.find(findCrisis);
			res.render('crisiseditor', {crisis : crisis, system : system});
		}
	})
}

systemController.editCrisis = function(req, res) {
	backURL = req.header('Referer') || '/';
	console.log(req.params.crisis);
	System.findById(req.params.id, function(err, system){
		if (err) {
			console.log(err);
		} else {
			var crisis = system.crises.id(req.params.crisis);
			crisis.crisisname = req.body.crisisname;
			crisis.crisisevents = [];
			if (Array.isArray(req.body.eventname)) {
				for (var i =0, len = req.body.eventname.length; i < len; i++) {
					var event = {eventtitle : req.body.eventname[i], eventdescription : req.body.eventdescription[i]};
					crisis.crisisevents.push(event);
				} 
			} else {
				var event = {eventtitle : req.body.eventname, eventdescription : req.body.eventdescription};
				crisis.crisisevents.push(event);
			}
			system.save(function(err, system){
				if (err) {
					console.log(system);
				} else {
					res.redirect('../../system' + system._id);
				}
			});
		}
	});
}

module.exports = systemController;