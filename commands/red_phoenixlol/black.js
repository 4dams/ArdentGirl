exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  client.say(channel, messagePrefix + `${userstate['display-name']} ist ${Math.round((Math.random() * 101) * 100) / 100}% black! TriHard`)
}