var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
	author : {
		type : Schema.Types.ObjectId,
		ref : 'Character'
	},
	title : String,
	brief: String,
	copy : String,
	characters : [{
		type : Schema.Types.ObjectId,
		ref : 'Character'
	}],
	systems : [{
		type : Schema.Types.ObjectId,
		ref : 'System'
	}]
},
{
	usePushEach : true,
	timestamps : true
});

module.exports = mongoose.model('Article', Article);