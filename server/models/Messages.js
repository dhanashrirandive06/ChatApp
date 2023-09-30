const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const messageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
