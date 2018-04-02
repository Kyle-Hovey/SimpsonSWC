var express = require('express');
var account = require('../controllers/AccountController');
var router = express.Router();

// Restricts Access to logged in users only
router.get('/', account.home);

//Go to registration page
router.get('/register', account.register);

//Post registration
router.post('/register', account.doRegister);

//Go to login page
router.get('/login', account.login);

//Post Login
router.post('/login', account.doLogin);

//logout
router.get('/logout', account.logout);

//profile page
router.get('/profile', account.profile);

//Go to Edit Profile
router.get('/editprofile', account.editProfile);

//Post Edit Profile
router.post('/editprofile', account.doEditProfile);

//Go to Change Password Page
router.get('/changepassword', account.changePassword);

//Post Change Password
router.post('/changepassword', account.doChangePassword);

//cnn
router.get('/cnn', account.cnn);

//create news post
router.get('/newspost', account.newsPost);

module.exports = router;