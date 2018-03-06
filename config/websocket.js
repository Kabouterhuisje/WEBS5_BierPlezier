module.exports = function(io){
	io.on('connection', function(socket){
		console.log('user connected');
		socket.on('disconnect', function(){
		  console.log('user disconnected');
		});
		socket.on('server_race_adduser', function(msg){
		  console.log('User added to race: ' + msg);
		  socket.broadcast.emit('client_race_adduser', msg);
		  socket.emit('client_race_participate', msg);
		});
		socket.on('server_race_addwaypoint', function(msg){
		  console.log('Waypoint added to race: ' + msg);
		  socket.broadcast.emit('client_race_addwaypoint', msg);
		});
		socket.on('server_waypoint_checkin', function(msg){
		  console.log('User added to waypoint: ' + msg);
		  socket.broadcast.emit('client_waypoint_adduser', msg);
		  socket.emit('client_waypoint_checkin', msg);
		});
	});
};