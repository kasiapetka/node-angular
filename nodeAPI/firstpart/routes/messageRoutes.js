const Message = require("../model/Message");
const { Op } = require("sequelize");
const checkSessions = require("../utils/checkSessions").checkSessions;
var onlineUsers = require("../utils/onlineUsers");
const User = require("../model/User");

module.exports = (app) => {
    app.get("/api/messages/:id", [checkSessions, getMessages]);

    app.post("/api/messages/", [checkSessions, sendMessages]);
};

function getMessages(request, response) {
    let userId = request.params.id;
    Message.findAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { message_to_user_id: userId },
                        { message_from_user_id: request.session.user_id },
                    ],
                },
                {
                    [Op.and]: [
                        { message_to_user_id: request.session.user_id },
                        { message_from_user_id: userId },
                    ],
                },
            ],
        },
    }).then((messages) => {
        console.log(messages);
        response.send({ data: messages });
    });
}

function sendMessages(request, response) {
    console.log(request.body);
    var message_text = request.body.message_text;
    var to = request.body.message_to_user_id;
    console.log(
        `Received message => ${message_text} from ${request.session.user_id} to ${to}`
    );

    User.findAll({ where: { user_id: to } }).then((users) => {
        if (users.length >= 1) {
            var mes = {
                message_from_user_id: request.session.user_id, //TODO
                message_to_user_id: users[0].user_id,
                message_text: message_text, //TODO
            };
            var user = users[0];
            Message.create(mes)
                .then((mes) => {
                    console.log("4ee", onlineUsers.getUsers());

                    if (user.user_id in onlineUsers.getUsers()) {
                        // Wysyłanie wiadomości do użytkownika
                        let wssss = onlineUsers.getUsers()[user.user_id];
                        wssss.send(message_text);
                    }
                    if (mes.message_from_user_id !== mes.message_to_user_id) {
                        if (
                            mes.message_from_user_id in onlineUsers.getUsers()
                        ) {
                            // Wysyłanie wiadomości do samego siebie jeżeli użytkownik nie wysyła wiadomości do siebie.
                            let wssss =
                                onlineUsers.getUsers()[request.session.user_id];
                            wssss.send(message_text);
                        }
                    }

                    response.send({ sending: true });
                })
                .catch(function (err) {
                    console.log(err);
                    response.send({ error: err });
                });
        } else {
            response.send({ error: "User not exists" });
        }
    });
}
