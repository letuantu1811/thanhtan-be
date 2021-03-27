const moment = require("moment");
exports.tzSaiGon = () => {
    let saigonTime = moment.tz('Asia/Saigon').format('YYYY-MM-DD').toString().slice(0, 10);
    return saigonTime;
    // $('#MomentRocks').text(date.form/at())
}