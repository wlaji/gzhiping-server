var express = require('express');
var path = require('path');
var cors = require('cors');
var cookie = require('cookie-parser');
var app = express();
var router = require('./router/index');
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(cors());
app.use(cookie());

app.use('/',router);

app.use('/public', express.static(__dirname + '/public'));
const server=app.listen(8000,'127.0.0.1',()=>{
  const host = server.address().address
  const port = server.address().port
  console.log('Listen at http://%s:%s', host, port)
})