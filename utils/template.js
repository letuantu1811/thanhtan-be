const { readFileAsync } = require("./file.helper");

exports.getDataTemplate = async (filename) => {
  if (!filename) {
      throw new Error("Yêu cầu filename");
  }
  
  const bufferData = await readFileAsync(filename);
  return bufferData ? bufferData.toString() : "";
};

exports.replaceValueHtml = (html = "", params) => {
  if (!html || !params) {
      return html;
  }

  for (const param of params) {
      const regExp = new RegExp(param.code, "g");
      if (html.match(regExp) && param.value) {
          html = html.replace(regExp, param.value);
      }
  }
  return html;
};