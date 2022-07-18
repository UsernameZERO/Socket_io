const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
} = require('./utils/users');

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

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        let msg = 'Welcome you to the chat!!';
        socket.emit('messageR', formatMessage(botName, msg));

        socket.broadcast.to(user.room).emit('messageL', formatMessage(botName, `${username} has joined chat`));
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // console.log(socket.id);


    socket.on('chatMsg', (msg) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('messageL', formatMessage(user.username, msg));
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {
            let msg = `${user.username} has left the chat`;
            io.to(user.room).emit('messageL', formatMessage(botName, msg));
            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }


    });


});