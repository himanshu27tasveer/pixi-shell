const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const brushSize = document.querySelector("#brush-size");
const brushColor = document.querySelector("#brush-color");
const eraserSize = document.querySelector("#eraser-size");
const undoBtn = document.querySelector("#undo");
const redoBtn = document.querySelector("#redo");

// Set default brush color and size
let color = brushColor.value;
let size = brushSize.value;
let isDrawing = false;

// Function to save the current canvas state
function saveState() {
  pointer++;
  state.push(canvas.toDataURL());
}

// Set canvas size explicitly to match its displayed size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#ffffff"; // Set to the desired background color
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initial save of canvas state
saveState();

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  socket.emit("startDrawing", {
    x: e.clientX,
    y: e.clientY,
    roomId: roomId,
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    socket.emit("drawStroke", {
      roomId: roomId,
      coordinates: { x: e.clientX, y: e.clientY },
      color: isErasing ? "white" : color,
      size: isErasing ? eraserSize.value : size,
    });
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  // Save the current canvas state after drawing
  if (pointer < state.length - 1) {
    state = state.slice(0, pointer + 1);
  }
  saveState();
  socket.emit("updateState", {
    roomId: roomId,
    canvasState: state,
    canvasPointer: pointer,
  });
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

brushSize.addEventListener("change", (e) => {
  size = e.target.value;
});

brushColor.addEventListener("change", (e) => {
  brushColor.value = e.target.value;
  color = e.target.value;
});

undoBtn.addEventListener("click", () => {
  if (pointer > 0) {
    pointer--;
  }
  socket.emit("undoRedo", {
    roomId: roomId,
    canvasState: state[pointer],
    width: canvas.width,
    height: canvas.height,
  });
  socket.emit("updateState", {
    roomId: roomId,
    canvasState: state,
    canvasPointer: pointer,
  });
});

redoBtn.addEventListener("click", () => {
  if (pointer < state.length - 1) {
    pointer++;
  }
  socket.emit("undoRedo", {
    roomId: roomId,
    canvasState: state[pointer],
    width: canvas.width,
    height: canvas.height,
  });
  socket.emit("updateState", {
    roomId: roomId,
    canvasState: state,
    canvasPointer: pointer,
  });
});

function startDrawing(coordinates) {
  ctx.beginPath();
  ctx.moveTo(coordinates.x, coordinates.y);
}

function drawStroke({ coordinates, color, size }) {
  ctx.lineTo(coordinates.x, coordinates.y);
  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function undoRedo(data) {
  const url = data.canvasState;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, data.width, data.height);
  };
}

function updateState(data) {
  state = data.canvasState;
  pointer = data.canvasPointer;
}

// sockets func

socket.on("startDrawing", (data) => {
  startDrawing(data);
});

socket.on("drawStroke", (data) => {
  drawStroke(data);
});

socket.on("updateState", (data) => {
  updateState(data);
});

socket.on("undoRedo", (data) => {
  undoRedo(data);
});
