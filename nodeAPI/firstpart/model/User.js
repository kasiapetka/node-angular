//dołączanie modułu ORM
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "root", "root", {
    dialect: "sqlite",
    storage: "orm-db.sqlite",
});

// Stworzenie modelu - tabeli User
const User = sequelize.define("user", {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name: Sequelize.STRING,
    user_password: Sequelize.STRING,
});

// synchroniznacja bazy danych - np. tworzenie tabel
sequelize.sync({ force: true }).then(() => {
    console.log(`Database & tables created!`);
});

module.exports = User;
