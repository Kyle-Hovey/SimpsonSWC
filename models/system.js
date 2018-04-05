var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var System = new Schema({
	owner : {
		type : Schema.Types.ObjectId,
		ref : 'Account'
	},
	name : {
		type : String,
		unique : true,
		required : [true, 'Name is a required field']
	},
	overview : String,
	history : String,
	patrons : [{
		type: Schema.Types.ObjectId,
		ref : 'Character'
	}],
	proxies : [{
		type: Schema.Types.ObjectId,
		ref : 'Character'
	}],
	crises : [{
		crisisname : String,
		crisisevents : [{
			eventtitle : String,
			eventdescription :  String}]
	}]
},
{
	usePushEach: true
});

module.exports = mongoose.model('System', System);