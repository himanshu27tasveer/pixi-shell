const roomIdEl = document.querySelector("#room-id");
const roomIdInputEl = document.querySelector("#room-link");
const roomSelectModal = document.querySelector("#transparent-bg");
const createRoomBtn = document.querySelector("#create-room-btn");
const joinRoomModalBtn = document.querySelector("#join-room-modal");
const joinRoomModalInput = document.querySelector("#room-id-input-modal");
const joinRoomMainBtn = document.querySelector("#join-room-main");
const joinRoomMainInput = document.querySelector("#new-room-id");

let roomId = "";

roomIdEl.addEventListener("click", (e) => {
  // copy roomId
  if (navigator.clipboard) {
    navigator.clipboard.writeText(roomId);
    alert("Room Id Copied");
  } else {
    roomIdInputEl.value = roomId;
  }
});

createRoomBtn.addEventListener("click", (e) => {
  socket.emit("createRoom");
});

joinRoomMainBtn.addEventListener("click", (e) => {
  if (
    joinRoomMainInput.value.length > 0 &&
    roomId !== joinRoomMainInput.value
  ) {
    socket.emit("joinRoom", joinRoomMainInput.value);
  }
});

joinRoomModalBtn.addEventListener("click", (e) => {
  if (joinRoomModalInput.value.length > 0) {
    socket.emit("joinRoom", joinRoomModalInput.value);
  }
});

function joinRoom(data) {
  const { id, canvasState, canvasPointer, users } = data;
  console.log("data", data);
  roomId = id;
  roomSelectModal.style.display = "none";
  roomIdEl.innerHTML = `Room Id: ${roomId}`;
  if (canvasState.length > 0) {
    state = canvasState;
    pointer = canvasPointer;
    const url = state[pointer];
    const img = new Image();
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    console.log("User joined room", users);
  }
}

socket.on("joinedRoom", (data) => {
  joinRoom(data);
});
