var express = require('express');
var http= require('http');
var path = require('path');
var cors = require('cors');
var cookie = require('cookie-parser');
var app = express();
var port = process.env.PORT || 3002;
var router = require('./router/index');
const server = http.createServer(app);
require('./socketIO/socketIO_server')(server);


app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(cors({credentials: true, origin: 'http://114.55.66.46:3001'}));
app.use(cookie());

app.use('/',router);

app.use('/public', express.static(__dirname + '/public'));

server.listen(port,'0.0.0.0',()=>{
  const host = server.address().address
  const port = server.address().port
  console.log('Listen at http://%s:%s', host, port)
})