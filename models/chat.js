var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chat = new Schema({
	creator: 
	{
		type: Schema.Types.ObjectId,
		ref : 'Character'
	},
	recipient: {
		type: Schema.Types.ObjectId,
		ref : 'Character'
	},
	messages : [{
		author: {
			type : Schema.Types.ObjectId,
			ref : 'Character'
		},
		message : {
			type : String,
		},
	},
	{
			timestamp: true
	}]
},
{
	usePushEach : true,
});

module.exports = mongoose.model('Chat', Chat);