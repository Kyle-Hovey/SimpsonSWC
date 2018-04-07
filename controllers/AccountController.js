var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Character = require('../models/character');

var accountController = {};

// GET home page. Restricts Access to people with accounts
accountController.home = function(req, res) {
  if (req.user){
	  Account.findById(req.user._id).populate('roles').exec(function(err, account){
  		if (err) {
  			console.log(err);
	  	} else{
  			res.render('index', { user : account });
  		}
  	});
	} else res.render('index', {user : req.user});
};

//Go to registration page
accountController.register =  function(req, res) {
	res.render('register');
};

//Post registration
accountController.doRegister = function(req, res) {
	console.log("registering: " + req.body.username);
	Account.register(new Account({ username : req.body.username, usertype : req.body.usertype, firstName : req.body.firstname, lastName : req.body.lastname, email : req.body.email}), req.body.password,  function(err, account) {
		if (err) {
			console.log(err);
			return res.render('register', {error: err.message});
			//return res.render('register', { account : account });
		} else {
			console.log('successful registration');
			passport.authenticate('local')(req, res, function() {
				res.redirect('/');
			});
		}
	});
};

//Go to login page
accountController.login = function(req, res) {
	res.render('login');
};

//Post Login
accountController.doLogin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.render('login', {message : 'Username or Password is incorrect'});
		}

		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			res.redirect('/');
		});
	})(req, res);
};

	/*(req, res, function(err) {
		if (err) {
			console.log(err);
			return res.render('login', {error : err.message});
		} else {
			console.log('successful login');
			res.redirect('/');
		}
	});*/

//logout
accountController.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

//Go to Change password page
accountController.changePassword = function (req, res) {
	if (req.user){
	  	Account.findById(req.user._id).populate('roles').exec(function(err, account){
			res.render('changepassword', {user : account});
		});
	} else res.render('changepassword', {user : req.user});
}

accountController.doChangePassword = function(req, res) {
	req.user.changePassword(req.body.oldpassword, req.body.newpassword, function(err, account){
		if(err) {
			console.log(err);
			return res.render('changepassword', {error : err.message});
		} else {
			console.log('Successful password change');
			res.redirect('/');
		}
	});
};

//Go to Profile Page
accountController.profile = function(req, res) {
	if (req.user){
	  	Account.findById(req.user._id).populate('roles').exec(function(err, account){
			res.render('profile', {user : account});
		});
	} else res.render('profile', {user : req.user});
};

//Go to Edit Profile Page
accountController.editProfile = function(req,res) {
	if (req.user){
	  	Account.findById(req.user._id).populate('roles').exec(function(err, account){
			res.render('editprofile', {user: account});
		});
	} else res.render('editprofile', {user: req.user});
};

//Edit Profile
accountController.doEditProfile = function(req, res) {
	if(req.body.firstname){
		console.log('updating firstname of ' + req.user.username + 'from ' + req.user.firstName + 'to ' + req.body.firstname);
		Account.findOneAndUpdate({username : req.user.username}, {firstName : req.body.firstname}, function(){
			console.log('first name updated');
		});
	};
	if(req.body.lastname){
		Account.findOneAndUpdate({username : req.user.username}, {lastName : req.body.lastname}, function(){
			console.log('last name updated');
		});
	};
	if(req.body.email){
		Account.findOneAndUpdate({username : req.user.username}, {email : req.body.email}, function(){
			console.log('email updated');
		});
	};

	res.redirect('profile');
};

accountController.accountManager = function(req, res) {
	if (req.user){
	  	Account.findById(req.user._id).populate('roles').exec(function(err, account){
			Account.find().populate('roles').exec(function(err, accounts) {
				if (err) {
					console.log(err);
				} else {
					res.render('accountmanager', {user : account, accounts : accounts});
				}
			});
		});
	} else {
		Account.find().populate('roles').exec(function(err, accounts) {
			if (err) {
				console.log(err);
			} else {
				res.render('accountmanager', {user : req.user, accounts : accounts});
			}
		});
	}
};

accountController.passwordReset = function(req, res) {
	Account.findById(req.params.id, function(err, account) {
		if (err) {
					console.log(err);
		} else{
			res.render('passwordreset', {user : req.user, account : account});
		}
	});
};

accountController.resetPassword = function(req, res) {
	Account.findById(req.params.id, function(err, account) {
		if (err) {
			console.log(err);
		} else {
			account.setPassword(req.body.newpassword, function(err, account) {
				if (err){
					console.log(err);
				} else {
					account.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							res.redirect('../accountManager');
						}
					});
				}
			});
		}
	});
};

accountController.characterManager = function(req, res) {
	Account.findById(req.params.id).exec(function(err, account){
		if (err) {
			console.log(err);
		} else {
			Character.find().exec(function(err, characters){
				if (err) {
					console.log(err);
				} else {
					res.render('charactermanager', {user : req.user, account : account , characters : characters});
				}
			});
		}

	});
};

accountController.assignCharacters = function(req, res) {
	Account.findById(req.params.id).exec(function(err, account) {
		if (err) {
			console.log(err);
		} else {
			account.roles = []
			if (Array.isArray(req.body.characters)) {
				for(var i = 0, len = req.body.characters.length; i < len; i++) {
					account.roles.push(req.body.characters[i]);
				}
			} else if (req.body.characters !== null) {
				account.roles.push(req.body.characters);
			} else {
				account.roles = [];
			}
			account.save(function(err, account) {
				if (err) {
					console.log(err);
				} else {
					console.log(account);
					res.redirect('../accountmanager')
				}
			})
		}
	})
};

module.exports = accountController;