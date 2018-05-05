var jsonfile = require("jsonfile")
var counterFile = './counter.json'

exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  jsonfile.readFile(counterFile, (err, obj) => {
    let tiltCount = obj.tilt
    client.say(channel, messagePrefix + `Ist Mehmet wieder am tilten? Das ist jetzt schon das ${tiltCount + 1}. Mal! 😡`)

    var obj = {
      tilt: tiltCount + 1
    }

    jsonfile.writeFile(counterFile, obj, {
      spaces: 2
    }, (err) => {
      console.error(err)
    })
  })
}