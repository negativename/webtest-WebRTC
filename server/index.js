const server = require("http").createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const registerMessageHandlers = require('./handlers/messagesHandlers');
const registerUserHandlers = require('./handlers/userHandlers');

const onConnection = (socket) => {
    const {roomId} = socket.handshake.query;
    socket.roomId = roomId;
    socket.join(roomId);

    if (socket.roomId === "chatroom") {
        registerMessageHandlers(io, socket);
        registerUserHandlers(io, socket);

        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    }else{
        if (socket.roomId === "videochat"){

            socket.emit("localUser", socket.id);

            socket.on("disconnect", () => {
                socket.broadcast.emit("callEnded");
            });

            socket.on("callUser", (data) => {
                io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
            });

            socket.on("answerCall", (data) => {
                io.to(data.to).emit("callAccepted", data.signal);
            });
        }
    }
};

io.on('connection', onConnection);

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server ready. Port: ${PORT}`)
})