var express = require('express');
var passport = require('passport');
var Account = require('../models/account');

var accountController = {};

// GET home page. Restricts Access to people with accounts
accountController.home = function(req, res) {
  res.render('index', { user : req.user });
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
	res.render('changepassword', {user : req.user});
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
	res.render('profile', {user : req.user});
};

//Go to Edit Profile Page
accountController.editProfile = function(req,res) {
	res.render('editprofile', {user: req.user});
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

//Go to cnn
accountController.cnn = function(req, res) {
	res.render('cnn', { user : req.user });
};

accountController.newsPost = function(req,res) {
	res.render('newspost');
};

module.exports = accountController;