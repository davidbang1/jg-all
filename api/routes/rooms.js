const express = require("express");
const router = express.Router();
const Room = require("../models/room");

//get all
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//get one
router.get("/:id", (req, res) => {
  res.send(req.params.id);
});

//create one
router.post("/", async (req, res) => {
  const room = new Room({
    name: req.body.roomId,
    password: req.body.password,
    player1: req.body.p1,
    player2: req.body.p2,
  });
  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//edit one
router.get("/", (req, res) => {});

module.exports = router;
