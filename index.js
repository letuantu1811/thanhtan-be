const express = require("express");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");
const session = require("express-session");
const PORT = process.env.PORT || 3001;
const db = require("./database/config");
const cors = require("cors");
const initAPI = require('./routers/')
const ApiError = require('./utils/api.res/api.error');
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
const {
    message
} = require('./utils//api.res')
const {
    errorConverter,
    errorHandler
} = require('./middlewares/error');
app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(
    session({
        secret: "123",
        resave: false,
        httpOnly: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 3600,
            secure: false
        }
    })
);
// swaggerDOC(app);
//db
db.authenticate()
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("error: " + err));

// routes
initAPI(app);
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    if (req.url === "/") {
        app.get('/', function(req, res) {
            res.render("index.html");
        });
        ``
    } else {
        next(new ApiError(message.getMessage('status.notfound'), message.getMessage('http.notfound')));
    }
});
app.use(errorConverter);

// handle error
app.use(errorHandler);