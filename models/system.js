var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var System = new Schema({
	owner : {
		type : Schema.Types.ObjectId,
		ref : 'Account'
	},
	name : {
		type : String,
		unique : [true, '{VALUE} already exists'],
		required : [true, 'Name is a required field']
	},
	crisis : String,
	history : String,
	patrons : {
		type: [Schema.Types.ObjectId],
		ref : 'Character'
	},
	proxies : {
		type: [Schema.Types.ObjectId],
		ref : 'Character'
	}
});

module.exports = mongoose.model('System', System);