const express = require("express");
const socket = require("socket.io");
const { addUser } = require("./users.js");

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

function generateUniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
}

// global state = { 'id1': {
// state: [],
// pointer: 0,
// users: {}
// }};

let globalState = {};

app.use(express.static("public"));

app.get("/healthz", (req, res) => {
  res.status(200).send("Ok");
});

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
  console.log("Listening to port" + port);
});

let io = socket(server, {
  maxHttpBufferSize: 50 * 1024 * 1024, // 50MB limit
});

io.on("connection", (socket) => {
  console.log("Made socket connection");

  socket.on("createRoom", () => {
    const roomId = generateUniqueId();
    const roomInfo = addUser({ room: roomId, id: socket.id }, globalState);
    console.log(`Room created with id ${roomId}`);
    socket.join(roomId);
    io.in(roomId).emit("joinedRoom", roomInfo);
  });

  socket.on("joinRoom", (roomId) => {
    const roomInfo = addUser({ room: roomId, id: socket.id }, globalState);
    console.log(`Room joined with id ${roomId}`);
    socket.join(roomId);
    socket.emit("joinedRoom", roomInfo);
    socket.to(roomId).emit("someoneJoined", socket.id);
  });

  socket.on("startDrawing", (data) => {
    io.in(data.roomId).emit("startDrawing", data);
  });

  socket.on("drawStroke", (data) => {
    io.in(data.roomId).emit("drawStroke", data);
  });

  socket.on("undoRedo", (data) => {
    io.in(data.roomId).emit("undoRedo", data);
  });

  socket.on("updateState", (data) => {
    globalState[data.roomId].canvasState = data.canvasState;
    globalState[data.roomId].canvasPointer = data.canvasPointer;
    io.in(data.roomId).emit("updateState", data);
  });
});
