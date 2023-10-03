const express = require("express");
const router = express.Router();
const Room = require("../models/room");

//create a room with a password
router.post("/", async (req, res) => {
  const myRoom = new Room({
    name: req.body.name,
    password: req.body.password,
    player1: req.body.player1,
    board: req.body.board,
    threeDeck: req.body.threeDeck,
    twoDeck: req.body.twoDeck,
    oneDeck: req.body.oneDeck,
  });
  try {
    const newRoom = await myRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//add a player 2
router.post("/search", getRoom, (req, res) => {
  //
  try {
    res.send(res.room);
  } catch (err) {
    res.status(404).json({ message: "not found" });
  }
  //res.send(req.room.name);
});

//delete room when both players leave

//get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    const copyItems = [];

    rooms.forEach((e) => {
      copyItems.push(e.name);
    });
    res.status(201).json(copyItems);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//get one and update p2
router.get("/", getRoom, async (req, res) => {
  try {
    //get works, need to add player2
    res.json(res.room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRoom(req, res, next) {
  //middleware for getting id or something
  let room;
  try {
    room = await Room.findOneAndUpdate(
      { password: req.body.password },
      { $set: { player2: req.body.player2 } },
      { returnNewDocument: true }
    );
    if (room === null) {
      return res.status(404).json({ message: "cannot find the room" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.room = room;
  //sets for the rest of the calls
  next();
}

module.exports = router;
