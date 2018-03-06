init = function(mongoose){
	
	var raceSchema = new mongoose.Schema({
		name: { type: String, required: true, index: { unique: true } },
		description: { type: String, required: true },
		status: { type: String, required:true },
		date_start: { type: Date, required: true },
		waypoints: [ {type : mongoose.Schema.ObjectId, ref : 'Waypoint'} ],
		users: [ {type : mongoose.Schema.ObjectId, ref : 'User'} ]
	});

	mongoose.model('Race', raceSchema);
	console.log('Race schema aangemaakt');
};

module.exports = init;