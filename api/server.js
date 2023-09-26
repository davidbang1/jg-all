require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
app.set("view engine", "ejs");
var cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  // res.send("hello");
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });
});

app.post("/", (req, res) => {
  //old
  if (req.body.password === "password") {
    res.send("accept");
  } else {
    res.send("reject");
  }
});

server.listen(8000);
