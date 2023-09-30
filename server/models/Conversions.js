const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const conversationSchema = new Schema({
  members: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
