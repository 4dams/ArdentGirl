let responses = [
  '"Ja!"',
  '"Auf jeden Fall!"',
  '"Natürlich!"',
  '"Eventuell. 🤔"',
  '"Vielleicht."',
  '"Mit großer Wahrscheinlichkeit." Kappa',
  '"Nö."',
  '"Nein."',
  '"Ich glaube nicht."',
  '"Auf keinen Fall" Kappa',
]

exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  client.say(channel, messagePrefix + `[🔮] Die magische Kugel sagt: ${responses[Math.floor(responses.length * Math.random())]}`)
}