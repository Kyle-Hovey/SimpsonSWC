var express = require('express');
var moment = require('moment');
var System = require('../models/system');
var Character = require('../models/character');
var Account = require('../models/account');
var Article = require('../models/article');

var cnnController = {};

cnnController.index = function(req, res) {
	Article.find().populate('author').sort('-createdAt').exec(function(err, articles) {
		if (err) {
			console.log(err);
		} else {
			res.render('cnn', {user : req.user, articles : articles, moment : moment});
		}
	});
};

cnnController.newArticle = function(req, res) {
	System.find().exec(function(err, systems) {
		if (err) {
			console.log(err);
		} else {
			Character.find().exec(function(err, characters) {
				if (err) {
					console.log(err);
				} else {
					res.render('newarticle', {user : req.user, systems : systems, characters : characters});
				}
			});
		}
	});
}

cnnController.postArticle = function(req, res) {
	if (req.user) {
		var newArticle = new Article;
		if (req.user.usertype == 'participant') {
			newArticle.author = req.user.roles[0];
		}
		newArticle.title = req.body.title;
		newArticle.brief = req.body.copy.substring(0, 100);
		newArticle.copy = req.body.copy;
		if (Array.isArray(req.body.systems)){
			for(var i = 0, len = req.body.systems.length; i < len; i++) {
			newArticle.systems.push(req.body.systems[i]);
			}
		}
		else {
			newArticle.systems.push(req.body.systems);
		}
		if (Array.isArray(req.body.characters)){
			for(var i = 0, len = req.body.characters.length; i < len; i++) {
			newArticle.characters.push(req.body.characters[i]);
			}
		} else {
			newArticle.characters.push(req.body.characters);
		}
		newArticle.save(function(err, newArticle) {
			if (err) {
				console.log(err);
			} else {
				console.log(newArticle);
				res.redirect('/cnn');
			}
		})
	} else {
		res.redirect('/cnn')
	}
};

module.exports = cnnController;