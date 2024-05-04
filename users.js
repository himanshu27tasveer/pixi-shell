function addUser(user, globalState) {
  const { room, id } = user;
  const doesRoomExist = globalState.hasOwnProperty(room);

  if (!doesRoomExist) {
    globalState[room] = {
      canvasState: [],
      canvasPointer: -1,
      users: [id],
      id: room,
    };
  } else {
    if (globalState[room].users.includes(id)) {
      return globalState[room];
    }
    globalState[room].users.push(id);
  }

  return globalState[room];
}

module.exports = { addUser };
