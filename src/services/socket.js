import Ws from '@adonisjs/websocket-client';

let socket = null;

function connect() {
  socket = Ws('wss://sigfapeap.msbtec.com.br');
  socket.connect();
}

function disconnect() {
  if (!socket) return;

  if (socket.connected) {
    socket.disconnect();
  }
}

function subscribeToChannel(channel, event, eventFunction) {
  if (!socket) {
    console.log("Socket is not connected!");
    return;
  }

  socket.subscribe(channel);
  socket.getSubscription(channel).on(event, eventFunction);
}

function emitToChannel(channel, event, data) {
  if (!socket) {
    console.log("Socket is not connected!");
    return;
  }

  socket.getSubscription(channel).emit(event, data);
}

export default {
  connect, disconnect, subscribeToChannel, emitToChannel,
};
