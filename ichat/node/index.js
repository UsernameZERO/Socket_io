const io = require("socket.io")(8000, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        console.log("enterd");
        console.log("new user", name)
        users[socket.id] = name;
        console.log("socket id --->", socket.id);
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("recieve", {
            message: message,
            name: users[socket.id]
        });

    });
})