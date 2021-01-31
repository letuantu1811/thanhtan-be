const {
  message
} = require('./api.res')
const {
  check
} = require('express-validator')

exports.validateCategory = () => {
  return [
    check('id', message.getMessageValidate("common.isempty-id")).not().isEmpty(),
    check('id', message.getMessageValidate("common.errtype-id")).isInt()
  ];
}
exports.validateCategoryCreate = () => {
  return [
    check('name', message.getMessageValidate("common.errtype-id")).not().isEmpty(),
  ];
}
exports.validateCategoryUpdate = () => {
  return [
    check('id', message.getMessageValidate("common.isempty-id")).not().isEmpty(),
    check('id', message.getMessageValidate("common.errtype-id")).isInt(),
    check('name', message.getMessageValidate("common.isempty-name")).not().isEmpty(),
  ];
}