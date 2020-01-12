// const credentials = require('./credentials');
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser');
let createError = require('http-errors');
let debug = require('debug')('socket_example:server');
let emailer = require('nodemailer');
let express = require('express');
let fs = require('fs');
let http = require('http');
let logger = require('morgan');
let mkdirp = require('mkdirp');
let os = require('os');
let path = require('path');
let util = require('util');
let broadcaster;
let server;
let port;
let rootDirectory = __dirname;
let app = express();
let httpIO = require('http').createServer(app);
let httpWS = require('http').createServer(app);
const IO_PORT = process.env.PORT || 33000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', `${rootDirectory}${path.sep}views`);

//tell Express we are using React.js
app.set('view engine', 'jsx');

// set path to *.jsx files
var options = { beautify: true };
app.engine('jsx', require('express-react-views').createEngine(options));

//put your static files (js, css, images) into /public directory
app.use(`${path.sep}public`, express.static(`${rootDirectory}${path.sep}public`));

app.use(`${path.sep}`, require(`${rootDirectory}${path.sep}route${path.sep}index`));
app.use(`${path.sep}broadcast`, require(`${rootDirectory}${path.sep}route${path.sep}broadcast`));

app.use(logger('dev'));
app.use(cookieParser());




const io = require('socket.io')(httpIO);
io.sockets.on('error', e => console.log(e));
io.sockets.on('connection', function (socket) {
  console.log(`connected: socket=[${socket.id}]`)
  socket.on('broadcaster', function () {
    console.log(`broadcaster: socket=[${socket.id}]`)
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', function () {
    console.log(`watcher: socket=[${socket.id}]`)
    broadcaster && socket.to(broadcaster).emit('watcher', socket.id);
  });
  socket.on('offer', function (id /* of the watcher */, message) {
    console.log(`offer: id=[${id}] socket=[${socket.id}]`)
    socket.to(id).emit('offer', socket.id /* of the broadcaster */, message);
  });
  socket.on('answer', function (id /* of the broadcaster */, message) {
    console.log(`answer: id=[${id}] socket=[${socket.id}]`)
    socket.to(id).emit('answer', socket.id /* of the watcher */, message);
  });
  socket.on('candidate', function (id, message) {
    console.log(`candidate: id=[${id}] socket=[${socket.id}]`)
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', function() {
    console.log(`disconnect: socket=[${socket.id}]`)
    broadcaster && socket.to(broadcaster).emit('bye', socket.id);
  });
});



if (typeof(PhusionPassenger) != 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
    httpIO.listen('passenger', function(){
      debug(`HTTP Listening as the PhusionPassenger`);
    });
}
else {
  httpIO.listen(IO_PORT, function(){
    debug(`HTTP Listening on ${ IO_PORT }`);
  });
}
