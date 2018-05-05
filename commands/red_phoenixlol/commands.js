exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  client.say(channel, messagePrefix + `Alle Commands für diesen Channel sind auf https://twitch.4da.ms/${channel.split('#')[1]} zu finden!`)
}