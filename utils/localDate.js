const moment = require("moment");
exports.localDate = (date) => {
    // var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 86400000);
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);
    newDate = new Date(newDate.getTime() - 25200000);

    return newDate;
}