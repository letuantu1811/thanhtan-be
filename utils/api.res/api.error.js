const ERROR_CODE = {
    BAD: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ERROR_INTERNAL: 500,
};

class HttpException extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class BadRequestException extends HttpException {
    constructor(message = 'Dữ liệu không hợp lệ') {
        super(ERROR_CODE.BAD, message);
    }
}

class UnAuthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(ERROR_CODE.UNAUTHORIZED, message);
    }
}
class ForbiddenException extends HttpException {
    constructor(message = 'Không có quyền truy cập') {
        super(ERROR_CODE.ERROR_INTERNAL, message);
    }
}
class NotFoundException extends HttpException {
    constructor(message = 'Không tìm thấy') {
        super(ERROR_CODE.NOT_FOUND, message);
    }
}
class InternalServerErrorException extends HttpException {
    constructor(message = 'Xảy ra lỗi hệ thống') {
        super(ERROR_CODE.ERROR_INTERNAL, message);
    }
}

module.exports = {
    HttpException,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    UnAuthorizedException,
    InternalServerErrorException,
};
