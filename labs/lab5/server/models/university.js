const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	numOfStudents: Number,
	campus: Number,
	foundationDate: {
		type: String,
		default: new Date(Date.now()).toISOString().split('T')[0],
	},
	image: String,
	dateAdded: {
		type: String,
		default: new Date().toLocaleString('en-US', { timeZone: 'Europe/Kaliningrad' }),
	},
	// specialty: {
	// 	type: String,
	// 	required: true,
	// },
});

module.exports = model('University', schema);
