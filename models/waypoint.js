init = function(mongoose){
	
	var waypointSchema = new mongoose.Schema({
		placeid: { type: String, required: true },
		name: { type: String, required: true },
		latitude: { type: Number, required: true },
		longitude: { type: Number, required: true },
		users: [ { type : mongoose.Schema.ObjectId, ref : 'User' } ]
	});

	mongoose.model('Waypoint', waypointSchema);
	console.log('Waypoint schema aangemaakt');
};

module.exports = init;