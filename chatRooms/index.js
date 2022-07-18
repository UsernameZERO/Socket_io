const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const formatMessage = require('./utils/messages');

app.set('port', process.env.PORT || 3000);
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Alexa_Bot"

io.on("connection", (socket) => {
    console.log("Socket connected ...");



    socket.on("joinRoom", ({
        username,
        room
    }) => {
        let msg = 'Welcome you to the chat!!';
        socket.emit('messageR', formatMessage(botName, msg));

        socket.broadcast.emit('messageL', formatMessage(botName, `${socket.id} has joined chat`));
    })

    // console.log(socket.id);


    socket.on('chatMsg', (msg) => {
        const useree = socket.id;
        socket.broadcast.emit('messageL', formatMessage(useree, msg));
    })
    socket.on('disconnect', () => {
        let msg = `A ${socket.id} has left the chat`;
        // let postion = 'Left'
        io.emit('messageL', formatMessage(botName, msg));
    })
})