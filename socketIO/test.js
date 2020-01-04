module.exports = function (server) {
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    socket.on('sendMsg', (data) => {
      console.log('服务器接收到浏览器的消息', data);
      io.emit('receiveMsg', data.name + '_' + data.data);
      console.log('服务器向浏览器发送消息', data);
    })
  });
}