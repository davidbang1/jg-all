const express = require("express");
const router = express.Router();
const Room = require("../models/room");

//create a room with a password
router.post("/", async (req, res) => {
  const myRoom = new Room({
    name: req.body.name,
    password: req.body.password,
    player1: req.body.player1,
  });
  try {
    const newRoom = await myRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//add a player 2
router.post("/:password", getRoom, (req, res) => {
  //
  res.send(req.room.name);
});

//delete room when both players leave

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
      { $set: { player2: "hsdfooddddffdfsdfdfsdfddoo" } },
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
