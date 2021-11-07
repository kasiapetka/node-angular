//dołączanie modułu ORM
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "root", "root", {
    dialect: "sqlite",
    storage: "orm-db.sqlite",
});

// Stworzenie modelu - tabeli Message
const Message = sequelize.define("message", {
    message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message_from_user_id: Sequelize.INTEGER,
    message_to_user_id: Sequelize.INTEGER,
    message_text: Sequelize.STRING,
});

// synchroniznacja bazy danych - np. tworzenie tabel
sequelize.sync({ force: true }).then(() => {
    console.log(`Database & tables created!`);
});

module.exports = Message;
