const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  player1: { type: String },
  player2: { type: String },
  board: [String],
  threeDeck: [mongoose.Schema.Types.Mixed],
  twoDeck: [mongoose.Schema.Types.Mixed],
  oneDeck: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model("Room", roomSchema);
