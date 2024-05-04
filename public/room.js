const roomIdEl = document.querySelector("#room-id");
const roomIdInputEl = document.querySelector("#room-link");
const shareRoomBtn = document.querySelector("#share-room");
const roomSelectModal = document.querySelector("#transparent-bg");
const createRoomBtn = document.querySelector("#create-room-btn");
const joinRoomModalBtn = document.querySelector("#join-room-modal");
const joinRoomModalInput = document.querySelector("#room-id-input-modal");
let roomId = "";

createRoomBtn.addEventListener("click", (e) => {
  socket.emit("createRoom");
});

joinRoomModalBtn.addEventListener("click", (e) => {
  if (joinRoomModalInput.value.length > 0) {
    socket.emit("joinRoom", joinRoomModalInput.value);
  }
});

function joinRoom(data) {
  const { id, canvasState, pointer, users } = data;
  roomId = id;
  roomSelectModal.style.display = "none";
  roomIdEl.innerHTML = `Room Id: ${roomId}`;
  if (canvasState.length > 0) {
    state = canvasState;
    pointer = canvasPointer;
    console.log("User joined room", users);
  }
}

socket.on("joinedRoom", (data) => {
  joinRoom(data);
});
