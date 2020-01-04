const {ChatModel} = require('../models')
module.exports = function (server) {
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    socket.on('sendMsg', ({from,to,content}) => {
      console.log('服务器接收到的消息',{from,to,content});
      //保存消息
      const chat_id=[from,to].sort().join('_');
      const create_time=Date.now();
      new ChatModel({from,to,content,chat_id,create_time}).save(function(err,chatMsg){
        //向客户端发消息
        io.emit('receiveMsg',chatMsg)
      })
    })
  });
}