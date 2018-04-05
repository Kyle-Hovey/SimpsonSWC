var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: 
		{
			type: String,
			validate: {
				validator: function(v) {
				return /^([A-Za-z\d\._-]){4,16}$/.test(v);
			},
			message : '{VALUE} is not a valid username. Usernames can contain uppercase and lowercase letters, numbers, and special characters . and _ .'
			},
			required: [true, 'Username is a required field']
		},
	password: 
		{
			type: String,
			validate: {
				validator: function(v) {
					return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(v);
				},
				message : 'Password does not meet requirements. Must contain be between 6 and 12 characters, and contain at least one uppercase and lowercase letter, and one number.'
			}
		},	
	usertype : {
			type: String,
			enum: ['controller', 'participant', 'custom'],
			required : [true, 'Please select usertype']
		},
	firstName: { 
		type: String,
		required : [true, 'Please enter your First Name']
		},
	lastName: { 
		type: String,
		required : [true, 'Please enter your Last Name']
		},
	email: 
		{
			type: String,
			validate: {
				validator : function(v) {
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message : 'Enter a valid email address.'
			},
			required : [true, 'Email is a required field.']
		},
	roles: [{
		type : Schema.Types.ObjectId,
		ref : 'Character'
	}]
},
{
	usePushEach: true
});

//var options = ({missingPasswordError: "Password Field Not filled out"});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

//^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$