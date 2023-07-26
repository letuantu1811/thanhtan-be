exports.success = (res, message, data) => {
  res.status(200).json({
    status: true,
    message: message,
    data: data
  })
}

exports.success_v2 = (res, message, data, pagination) => {
  res.status(200).json({
    status: true,
    message: message,
    data: data,
    pagination: pagination
  })
}

exports.error = (res, message, code, path) => {
  res.status(code).json({
    status: false,
    message: message,
    path: path,
  });
}