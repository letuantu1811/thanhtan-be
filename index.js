const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
require('dotenv').config();

const db = require('./database/config');
const initAPI = require('./routers/');
const { message } = require('./utils/api.res');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { HttpException } = require('./utils/api.res/api.error');

const PORT = process.env.PORT || 3001;

app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

app.use(
  session({
    secret: '123',
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 3600,
      secure: false,
    },
  })
);

// adding morgan to log HTTP requests
app.use(morgan('dev'));
// app.use(morgan('combined'));

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(compression());

// starting the server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

// init db
db.authenticate()
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('error: ' + err));

// routes
initAPI(app);

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  if (req.url === '/') {
    app.get('/', function (req, res) {
      res.render('index.html');
    });
  } else {
    next(new HttpException(message.getMessage('status.notfound'), message.getMessage('http.notfound')));
  }
});

app.use(errorConverter);

// handle error
app.use(errorHandler);
