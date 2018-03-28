var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Character = new Schema({
	_characterId : Schema.Types.ObjectId,
	type : {
		type : String,
		enum: ['patron', 'proxy', 'wildcard']
	},
	name : String,
	occupation : String,
	species : String,
	homesystem : String,
	backstory : String,
	motives : String,
	skills : [String], 
	special : [String],
	contacts : []
});

module.exports = mongoose.model('Character', Character);