var _onlineUsers = {};

exports.getUsers = function () {
    return _onlineUsers;
};

exports.setUsers = function (index, value) {
    _onlineUsers[index] = value;
};

exports.deleteUser = function (index) {
    delete _onlineUsers[index];
};
