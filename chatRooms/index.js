const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();

app.set('port', process.env.PORT || 3000);
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));


io.on("connection", (socket) => {
    console.log("Socket connected ...");
})