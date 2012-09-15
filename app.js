/**
 * Module dependencies.
 */
var public_path = __dirname + "/client/"

var app = require('express').createServer()
    , io = require('socket.io').listen(app);

app.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(public_path + 'taskboard.html');
});

app.get('/hello', function (req, res) {
    res.send('Hello REST API!');
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        socket.broadcast.emit("news", data);
    });
});