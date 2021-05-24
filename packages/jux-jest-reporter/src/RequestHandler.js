const fs = require('fs')

/**
 * API for incoming requests.
 * Keys are the "type" of the WS message.
 * For example:
 *   { type: "fetchSourceCode", file: "/Myfile.txt" }
 *
 * Will invoke the handler here with `fetchSourceCode` name and the request
 * will contain `file` field.
 * Return a value to respond. Or make it fail to send a failure response.
 * Functions support Promises
 */
const RequestHandler = {

  getContext: (req, context) => {
    return context
  },

  fetchSourceCode: req => new Promise((resolve, reject) => {
    const { file } = req
    fs.readFile(file, 'utf8' , (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

}

module.exports = RequestHandler