require("dotenv").config();
const { instrument } = require("@socket.io/admin-ui");
const { ExpressPeerServer } = require("peer");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("Connected to Database");
});
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
app.set("view engine", "ejs");
var cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const roomsRouter = require("./routes/rooms");
app.use("/rooms", roomsRouter);

io.on("connection", (socket) => {
  //works
  socket.on("join-room", (roomId, userId, position) => {
    socket.join(roomId);
    if (position === 2) {
      socket.to(roomId).emit("user-connected", userId, (response) => {
        //set remote
      });
    }
    socket.on("remove-royal", (arg) => {
      socket.to(roomId).emit("remove-royal2", arg);
    });
    socket.on("remove-this", (arg) => {
      socket.to(roomId).emit("remove-this2", arg);
    });

    socket.on("buy-card", (arg) => {
      socket.to(roomId).emit("buy-card2", arg);
    });

    socket.on("use-scroll", (arg) => {
      socket.to(roomId).emit("use-scroll2", arg);
    });

    socket.on("fill-board", (arg) => {
      socket.to(roomId).emit("fill-board2", arg);
    });

    socket.on("remove-reserved", (arg) => {
      socket.to(roomId).emit("remove-reserved2", arg);
    });

    socket.on("steal-jewel", (arg) => {
      socket.to(roomId).emit("steal-jewel2", arg);
    });

    socket.on("scroll-card", (arg) => {
      socket.to(roomId).emit("scroll-card2", arg);
    });

    socket.on("gem-picked", (arg) => {
      socket.to(roomId).emit("gem-picked2", arg);
    });
    socket.on("again-royal", (arg) => {
      socket.to(roomId).emit("again-royal2", arg);
    });
    socket.on("reserve-card", (arg) => {
      socket.to(roomId).emit("reserve-card2", arg);
    });

    socket.on("skip-turn", (arg) => {
      socket.to(roomId).emit("skip-turn2", arg);
    });

    socket.on("gold-board", (arg) => {
      socket.to(roomId).emit("gold-board2", arg);
    });

    socket.on("hello", (arg, callback) => {
      socket.broadcast.emit("increment", arg + 1);
      callback(arg + 1);
    });

    socket.on("sendBoard", (arg) => {
      io.emit("receiveBoard", arg);
    });

    // socket.on("sendCards", (arg) => {
    //   io.emit("receiveCards", arg);
    // });
    socket.on("uncaughtException", function (err) {
      console.log(err);
    });
  });
});

app.get("/test", (req, res) => {
  //remove later
  res.send("Welcome to Game!");
});
app.get("/getRoom", (req, res) => {
  res.send(uuidV4());
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

instrument(io, { auth: false });
