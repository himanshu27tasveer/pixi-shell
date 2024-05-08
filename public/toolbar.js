let isErasing = false;
const brushToolBox = document.querySelector("#brush-toolbox");
const eraserToolBox = document.querySelector("#eraser-toolbox");
const pencilBtn = document.querySelector(".fa-pencil");
const eraserBtn = document.querySelector(".fa-eraser");
const stickyNote = document.querySelector(".fa-note-sticky");
const downloadBtn = document.querySelector(".fa-download");
const uploadBtn = document.querySelector(".fa-upload");

brushToolBox.style.left = pencilBtn.offsetLeft + "px";
eraserToolBox.style.left = eraserBtn.offsetLeft + "px";

pencilBtn.addEventListener("click", () => {
  if (
    brushToolBox.style.display === "none" ||
    brushToolBox.style.display === ""
  ) {
    brushToolBox.style.display = "flex";
    eraserToolBox.style.display = "none";
    isErasing = false;
  } else {
    brushToolBox.style.display = "none";
  }
});

eraserBtn.addEventListener("click", () => {
  if (
    eraserToolBox.style.display === "none" ||
    eraserToolBox.style.display === ""
  ) {
    eraserToolBox.style.display = "flex";
    brushToolBox.style.display = "none";
    isErasing = true;
  } else {
    eraserToolBox.style.display = "none";
    isErasing = false;
  }
});

stickyNote.addEventListener("click", () => {
  createSticky();
});

function createSticky() {
  let stickyDiv = document.createElement("div");
  stickyDiv.setAttribute("class", "sticky-note");
  stickyDiv.innerHTML = `<div class="note-header">
      <i class="fa-solid fa-circle-xmark" style="color: red;"></i>
      <i class="fa-regular fa-window-maximize" style="color: green;"></i>
    </div>
    <textarea spellcheck="false" class="note-body"></textarea>`;
  document.body.appendChild(stickyDiv);
  let minimize = stickyDiv.querySelector(".fa-window-maximize");
  let close = stickyDiv.querySelector(".fa-circle-xmark");
  let noteContent = stickyDiv.querySelector(".note-body");
  minimize.addEventListener("click", () => {
    if (noteContent.style.display === "none") {
      noteContent.style.display = "block";
    } else {
      noteContent.style.display = "none";
    }
  });
  close.addEventListener("click", () => {
    stickyDiv.remove();
  });

  dragAndDrop(stickyDiv);
}

function dragAndDrop(stickyNote) {
  let isDown = false;
  stickyNote.addEventListener("mousedown", (e) => {
    isDown = true;
    let x = e.clientX;
    let y = e.clientY;
    let stickyNoteTop = stickyNote.offsetTop;
    let stickyNoteLeft = stickyNote.offsetLeft;
    document.addEventListener("mousemove", (e) => {
      if (isDown) {
        let x2 = e.clientX;
        let y2 = e.clientY;
        let finalX = x2 - x;
        let finalY = y2 - y;
        stickyNote.style.top = stickyNoteTop + finalY + "px";
        stickyNote.style.left = stickyNoteLeft + finalX + "px";
      }
    });
    document.addEventListener("mouseup", (e) => {
      isDown = false;
    });
  });
}

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = "drawing.png";
  a.click();
});

uploadBtn.addEventListener("click", () => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    let stickyDiv = document.createElement("div");
    stickyDiv.setAttribute("class", "sticky-note");
    stickyDiv.innerHTML = `<div class="note-header">
      <i class="fa-solid fa-circle-xmark" style="color: red;"></i>
      <i class="fa-regular fa-window-maximize" style="color: green;"></i>
    </div>
    <img src="${url}" class="note-body" style="border: 1px solid black;border-top: none;">`;
    document.body.appendChild(stickyDiv);
    let minimize = stickyDiv.querySelector(".fa-window-maximize");
    let close = stickyDiv.querySelector(".fa-circle-xmark");
    let noteContent = stickyDiv.querySelector(".note-body");
    minimize.addEventListener("click", () => {
      if (noteContent.style.display === "none") {
        noteContent.style.display = "block";
      } else {
        noteContent.style.display = "none";
      }
    });
    close.addEventListener("click", () => {
      stickyDiv.remove();
    });

    dragAndDrop(stickyDiv);
  });
});
