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
let state = [];
let pointer = -1;

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
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    ctx.lineTo(
      e.clientX - canvas.getBoundingClientRect().left,
      e.clientY - canvas.getBoundingClientRect().top
    );
    if (isErasing) {
      ctx.lineWidth = eraserSize.value;
      ctx.strokeStyle = "white";
    } else {
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
    }
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  // Save the current canvas state after drawing
  if (pointer < state.length - 1) {
    state = state.slice(0, pointer + 1);
  }
  saveState();
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
    const url = state[pointer];
    const img = new Image();
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }
});

redoBtn.addEventListener("click", () => {
  if (pointer < state.length - 1) {
    pointer++;
    const url = state[pointer];
    const img = new Image();
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }
});
