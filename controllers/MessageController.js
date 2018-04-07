var express = require('express');
var moment = require('moment');
var passport = require('passport');
var Account = require('../models/account');
var Character = require('../models/character');
var Messages = require('../models/message');

var messageController = {};

messageController.index = function(req, res) {
	if (req.user){
		Account.findById(req.user._id).populate('roles').exec(function(err, account){
			if (err) {
				console.log(err);
			}
			else{
				console.log(account);
				if (account.usertype == 'controller'){
					Messages.find().sort('-createdAt').populate('from').populate('to').exec(function(err, messages){
						if (err) {
							console.log(err);
						} else{
							res.render('messages', {user : account, messages : messages, moment: moment});
						}
					});
				} else if (account.usertype == 'participant') {
					Messages.find({$or : [{'from' : account.roles[0]}, {'to' : account.roles[0]}]}).sort('-createdAt').populate('from').populate('to').exec(function(err, messages){
						if (err) {
							console.log(err);
						}  else {
							res.render('messages', {user : account, messages : messages, moment : moment});
						}
					});
				}
			}
		});
	} else {
		res.redirect('../cnn');
	}
};

messageController.newMessage = function(req, res) {
	if(req.user){
		Account.findById(req.user._id).populate({path: 'roles', populate: {path : 'contact'}}).exec(function(err, account){
			if (err) {
				console.log(err)
			} else {
				Character.find({characterType : 'patron'}).exec(function(err, patrons){
					Character.find({characterType : 'proxy'}).exec(function(err, proxies){
						Character.find({characterType : 'wildcard'}).exec(function(err, wildcards){
							res.render('newmessage', {user : account, patrons : patrons, proxies : proxies, wildcards : wildcards});

						});
					})
				});
			}
		});
	}  else {
		res.redirect('../cnn');
	}
};

messageController.sendMessage = function(req, res) {
	if (req.user){
		Account.findById(req.user._id).populate('roles').exec(function(err, account){
			newMessage = new Messages;
			newMessage.from = req.body.from;
			newMessage.to = req.body.to;
			newMessage.message = req.body.message;
			newMessage.save(function(err, newMessage){
				if (err) {
					console.log(err);
				} else {
					console.log(newMessage);
					res.redirect('/messenger');
				}
			});
		});
	}
}

module.exports = messageController;