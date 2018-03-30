var bcrypt = require('bcrypt-nodejs');

init = function(mongoose){
	
	var userSchema = new mongoose.Schema({
		local            : {
	        email        : String,
	        password     : String
    	},
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		middle_name: { type: String, required:false },
		age: { type: Number, required: true },
		admin: {type: Boolean, required: true},
		facebook: {
			id: String,
			token: String,
			email: String,
			name: String
		}
    }, {
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	});

	userSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	userSchema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};

	userSchema.virtual('full_name').get(function(){
		var full_name = this.first_name + ' ';
		if(this.middle_name && this.middle_name.length) {
			full_name += " " + this.middle_name;
		}
		full_name += " " + this.last_name;
		return full_name;
	});	

	mongoose.model('User', userSchema);
	console.log('User schema aangemaakt');
};

module.exports = init;