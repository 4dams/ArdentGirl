exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  if (!userstate.mod) {
    client.timeout(channel, userstate.username, 1, `${userstate['display-name']} hat seine eigenen Nachrichten entfernt.`)
  } else {
    client.say(channel, messagePrefix + `Sorry, ich kann dich leider nicht einfach so verschwinden lassen.`)
  }
}