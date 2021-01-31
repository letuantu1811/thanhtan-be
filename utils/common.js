/**
 * Search list product in stock
 * @param {Object:any} data - data from request
 * @returns {products}
 */
exports.refineOptions = (options) => {
  if (!options) return {}
  for (const [key, value] of Object.entries(options)) {
    if (!value) delete options[key]
    if (key === "where") {
      options[key] = value ? (_ => {
        for (const [k, v] of Object.entries(value)) {
          if (!v) delete value[k]
        }
        return value
      })() : {}
    }
  }
}