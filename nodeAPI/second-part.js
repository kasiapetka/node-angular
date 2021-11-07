const WebSocket = require("ws");

const wss = new WebSocket.Server({
    noServer: true,
});

server.on("upgrade", function (request, socket, head) {
    // Sprawdzenie czy dla danego połączenia istnieje sesja
    sessionParser(request, {}, () => {
        if (!request.session.user_id) {
            socket.destroy();
            return;
        }
        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit("connection", ws, request);
        });
    });
});

let onlineUsers = {};

wss.on("connection", function (ws, request) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ status: 2 }));
        }
    });
    onlineUsers[request.session.user_id] = ws;

    ws.on("message", function (message) {
        console.log(message);
        // parsowanie wiadomosci z JSONa na obiekt
        try {
            var data = JSON.parse(message);
        } catch (error) {
            return;
        }
    });

    ws.on("close", () => {
        delete onlineUsers[request.session.user_id];
    });
});

// W funkcji pobierania użytkowników warto wykorzystać podany kod do
// przemapowania obiektów bazy danych na obiekty JSON
//users = users.map(user => {
//        return user.toJSON();
//});

// Przejscia po obiektach w liście obiektów i dodanie w nich odpowiedniego pola
//for (user of users) {
//    user.online = true;
//}
