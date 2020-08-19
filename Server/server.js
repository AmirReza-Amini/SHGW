require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app);
const setting = require('./app-setting')
const path = require('path')

app.use(cors())
require('./messaging/socket')(app, server);
app.use(express.json());
app.use(express.static(__dirname + '/www'));

app.use(require('./middleware/log'))
app.use(require('./bootstrap/init'));

require('./bootstrap/mongodb');
require('./routes')(app);

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/www/index.html'));
// });

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

server.listen((setting.portNo), () => {
  console.log(`Server started on ${setting.portNo} --- ${new Date()}`);
});