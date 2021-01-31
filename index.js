const express = require("express");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
const db = require("./database/config");
const cors = require("cors");
const initAPI = require('./routers/')

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
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