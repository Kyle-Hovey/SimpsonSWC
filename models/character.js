var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Character = new Schema({
	characterType : {
		type : String,
		enum: ['patron', 'proxy', 'wildcard']
	},
	name : {
		type: String,
		required : [true, 'Name is a required field'],
		unique : true
	},
	occupation : String,
	species : String,
	quirks : String,
	homesystem : String,
	backstory : String,
	longterm : String,
	shortterm : String,
	skills : [String], 
	special : [String],
	contact : {
		type : Schema.Types.ObjectId,
		ref : 'Character'
	}
},
{
	usePushEach: true
});

module.exports = mongoose.model('Character', Character);