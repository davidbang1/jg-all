require("dotenv").config();
const { ExpressPeerServer } = require("peer");
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

app.get("/test", (req, res) => {
  res.send("Welcome to Game!");
});

app.get("/getRoom", (req, res) => {
  res.send(uuidV4());
});

io.on("connection", (socket) => {
  //works
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId, (response) => {
      //set remote
    });
  });
  socket.on("hello", (arg, callback) => {
    socket.broadcast.emit("increment", arg + 1);
    callback(arg + 1);
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

srv = server.listen(8000, () => {
  console.log("Server started on port 8000");
});
app.use(
  "/peerjs",
  require("peer").ExpressPeerServer(srv, {
    debug: true,
  })
);
