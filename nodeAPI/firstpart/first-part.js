// pobranie modułu (include z c w nodejs)
var express = require("express");

// dołączenie modułu usuwającego problem z zabezpieczeniem CORS
const cors = require("cors");

// dołączenie modułu obsługi sesji
var session = require("express-session");

//Inicjalizacja aplikacji
var app = express();
//process.env.PORT - pobranie portu z danych środowiska np. jeżeli aplikacja zostanie uruchomiona na zewnętrznej platformie np. heroku
var PORT = process.env.PORT || 8080;
//uruchomienie serwera
var server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const sessionParser = session({
    saveUninitialized: false,
    secret: "$secret",
    resave: false,
});

// dołączenie modułu ułatwiającego przetwarzanie danych pochodzących z ciała zaytania HTTP (np. POST)
app.use(express.json());

// dołączenie modułu CORS do serwera
app.use(cors());

app.use(express.static(__dirname + "/second-part/"));

// dołączenie obslugi sesji do aplikacji
app.use(sessionParser);

require("./model/User");
require("./model/Message");
require("./websocket")(server, sessionParser);
require("./routes/userRoutes")(app);
require("./routes/messageRoutes")(app);
