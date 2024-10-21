const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
	Guild_ID: {
		type: String,
		required: true,
	},
	Message_ID: {
		type: String,
		required: true,
	},
	Channel_ID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Music Channel", ChannelSchema);