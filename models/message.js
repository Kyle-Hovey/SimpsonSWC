var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
	from : {
		type : Schema.Types.ObjectId,
		ref : 'Character'
	},
	to : {
		type : Schema.Types.ObjectId,
		ref : 'Character'
	},
	message : String
},
{
	usePushEach: true,
	timestamps: true
});

module.exports = mongoose.model('Message', Message);