exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  if (developers.includes(userstate.username)) {
    if (!args[0] == 0) {
      client.part(args[0])
      client.say(channel, messagePrefix + `ArdentGirl hat Channel "${args[0]}" verlassen.`)
    } else {
      client.say(channel, messagePrefix + `Du musst ein Ziel angeben! (!part <channel>)`)
    }
  } else {
    client.say(channel, messagePrefix + `Tut mir Leid, du hast leider keine Rechte für diesen Befehl!`)
  }
}