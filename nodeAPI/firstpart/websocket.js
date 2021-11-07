const WebSocket = require("ws");
const wss = new WebSocket.Server({
    noServer: true,
});

var onlineUsers = require("./utils/onlineUsers");

module.exports = (server, sessionParser) => {
    server.on("upgrade", function (request, socket, head) {
        // Sprawdzenie czy dla danego połączenia istnieje sesja
        sessionParser(request, {}, () => {
            // if (!request.session.user_id) {
            //     socket.destroy();
            //     return;
            // }
            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit("connection", ws, request);
            });
        });
    });

    wss.on("connection", function (ws, request) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                console.log("user conneted ");

                client.send(JSON.stringify({ status: 2 }));
            }
        });

        onlineUsers.setUsers(request.session.user_id, ws);

        ws.on("message", function (message) {
            // parsowanie wiadomosci z JSONa na obiekt
            console.log("on message");
            try {
                var data = JSON.parse(message);
                console.log(data);
            } catch (error) {
                return;
            }
        });

        ws.on("close", () => {
            console.log("user disconneted ");
            onlineUsers.deleteUser(request.session.user_id);
        });
    });
};
