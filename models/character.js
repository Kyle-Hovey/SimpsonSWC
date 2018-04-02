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
	homesystem : {
		type : Schema.Types.ObjectId,
		ref : 'System'
	},
	backstory : String,
	motives : String,
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

Character.statics.findOrCreate = function(characterName, characterType) {
	this.findOne({name : characterName}, function (err, character){
		if (err) {
			console.log(err);
			return err;
		} else if (character) {
			return character;
		} else {
			console.log('Creating new character named ' + characterName);
			var newCharacter = new this({name : characterName, characterType : characterType});
				newCharacter.save(function(err, newCharacter){
					if (err) {
						console.log(err);
						return err;
					} else {
						console.log(newCharacter + ' has been created.')
						return newCharacter;
					}
				}
			);
		}
	});
};

module.exports = mongoose.model('Character', Character);