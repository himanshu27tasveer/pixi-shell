const express = require("express");
const socket = require("socket.io");

const app = express();

let state = [];

app.use(express.static("public"));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
  console.log("Listening to port" + port);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("Made socket connection");

  socket.on("startDrawing", (data) => {
    io.sockets.emit("startDrawing", data);
  });

  socket.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });

  socket.on("undoRedo", (data) => {
    io.sockets.emit("undoRedo", data);
  });

  socket.on("updateState", (data) => {
    io.sockets.emit("updateState", data);
  });
});
