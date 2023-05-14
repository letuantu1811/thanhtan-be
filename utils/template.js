const { isObject, isEmpty } = require("lodash");
const { readFileAsync } = require("./file.helper");

exports.getDataTemplate = async (filename, extension = "html") => {
  if (!filename) {
    throw new Error("Yêu cầu filename");
  }

  const filePath = `${filename}.${extension}`;
  const bufferData = await readFileAsync(filePath);
  return bufferData ? bufferData.toString() : "";
};

exports.replaceValueHtml = (html = "", params) => {
  if (!html || !params) {
    throw new Error("Yêu cầu html hoặc paráms");
  }
  if (!isObject(params)) {
    throw new Error("Yêu cầu object");
  }
  for (const [key, value] of Object.entries(params)) {
    const regExp = new RegExp(`{${key}}`, "g");
    if (html.match(regExp)) {
      html = html.replace(regExp, value);
    }
  }
  return html;
};
