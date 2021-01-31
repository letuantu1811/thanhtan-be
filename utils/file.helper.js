const fs = require('fs')

const readFileAsync = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      }
      resolve(content)
    })
  })
}
const convertToJson = (data) => {
  try {
    if (data.length <= 0) {
      console.log("File is empty")
      return data
    } else {
      return JSON.parse(data)
    }
  } catch (err) {
    console.log("Parse JSON err", err)
  }
}
const writeFileAsync = (path, content) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, content, 'utf8', (err) => {
      if (err) reject(err)
      resolve("Ghi file thành công")
    })
  })
}
const appendFileAsync = (path, content) => {
  return new Promise(function (resolve, reject) {
    fs.appendFile(path, content, 'utf8', (err) => {
      if (err) reject(err)
      resolve("Ghi file thành công")
    })
  })
}

const checkExistFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, (err) => {
      if (err) reject(err)
      resolve("File đã tồn tại")
    })
  })
}
const countFileDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
      if (error) reject(error)
      resolve(files.length)
    });
  })
}
const getDataBykey = (data) => {
  let arr = []
  Object.keys(data).forEach(key => {
    arr.push(data[key])
  })
  return arr
}
const deleteFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err)
      }
      resolve("Đã xoá file")
    })
  })
}
const createDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve("Tạo file thành công")
      }
    });
  })
}

module.exports = {
  readFileAsync,
  writeFileAsync,
  convertToJson,
  checkExistFile,
  countFileDirectory,
  getDataBykey,
  deleteFile,
  appendFileAsync,
  createDirectory

}