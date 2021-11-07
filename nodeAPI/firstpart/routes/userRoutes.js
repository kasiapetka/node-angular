const User = require("../model/User");
const checkSessions = require("../utils/checkSessions").checkSessions;
var onlineUsers = require("../utils/onlineUsers");

module.exports = (app) => {
    app.get("/api/test-get", testGet);

    app.post("/api/register/", [register]);

    app.post("/api/login/", [login]);

    app.get("/api/login-test/", [checkSessions, loginTest]);

    app.get("/api/logout/", [checkSessions, logout]);

    app.get("/api/users/", [checkSessions, getUsers]);
};

function testGet(request, response) {
    response.send("testGet working");
}

// rejestrowanie użytkownika
function register(request, response) {
    console.log(User);
    var user_name = request.body.user_name;
    var user_password = request.body.user_password;
    if (user_name && user_password) {
        User.count({ where: { user_name: user_name } }).then((count) => {
            if (count != 0) {
                response.send({ register: false });
            } else {
                User.create({
                    user_name: user_name,
                    user_password: user_password,
                })
                    .then(() => response.send({ register: true }))
                    .catch(function (err) {
                        response.send({ register: true });
                    });
            }
        });
    } else {
        response.send({ register: false });
    }
}

// logowanie uzytkownika
function login(request, response) {
    let user_name = request.body.user_name;
    let provided_password = request.body.user_password;
    console.log(user_name);

    User.findOne({ where: { user_name: user_name } })
        .then((user) => {
            request.session.loggedin = user.user_password
                ? user.user_password === provided_password
                : false;

            request.session.user_id = user.user_id;
            response.send({ loggedin: request.session.loggedin });
        })
        .catch(function (err) {
            request.session.loggedin = false;
            response.send({ loggedin: request.session.loggedin });
        });
}

// sprawdzenie logowania jeżeli funkcja checkSessions nie zwróci błędu
function loginTest(request, response) {
    response.send({ loggedin: true });
}

function logout(request, response) {
    if (request.session) {
        request.session.destroy((err) => {
            if (err) {
                response.send({ loggedin: true });
            } else {
                response.send({ loggedin: false });
            }
        });
    }
}

function getUsers(request, response) {
    User.findAll().then((users) => {
        const modifiedUsers = users.map((user) => {
            if (onlineUsers.getUsers()) {
                console.log(onlineUsers.getUsers());
                user.dataValues.active = onlineUsers.getUsers()[
                    request.session.user_id
                ]
                    ? 1
                    : 0;
                return user;
            } else {
                user.dataValues.active = 0;
                return user;
            }
        });
        console.log(onlineUsers.getUsers());
        response.send({ data: modifiedUsers });
    });
}
