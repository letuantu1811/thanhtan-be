exports.success = (res, message, data) => {
  res.status(200).json({
    status: true,
    message: message,
    data: data
  })
}
exports.error = (res, message, code, data) => {
  res.status(code).json({
    status: false,
    message: message,
    data: data
  })
}