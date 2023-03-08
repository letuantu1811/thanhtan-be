const httpStatus = require('http-status');
const { HttpException } = require('../utils/api.res/api.error');
const config = {
  env: "development"
}

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof HttpException)) {
      const statusCode = error.statusCode
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new HttpException(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let {
    statusCode,
    message
  } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && {
      stack: err.stack
    }),
  };

  console.log(err);
  res.status(statusCode).send(response);


};

module.exports = {
  errorConverter,
  errorHandler,
};