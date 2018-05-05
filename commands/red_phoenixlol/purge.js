exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  if (userstate.mod || developers.includes(userstate.username)) {
    if (!args[0] == 0) {
      client.timeout(channel, args[0], 1, `${userstate['display-name']} hat alle Nachrichten von ${args[0]} entfernt.`)
      client.say(channel, messagePrefix + `Die letzten Nachrichten von !${args[0]} wurden erfolgreich entfernt.`)
    } else {
      client.say(channel, messagePrefix + `Du musst ein Ziel angeben! (!purge <username>)`)
    }
  } else {
    client.say(channel, messagePrefix + `Tut mir Leid, du hast leider keine Rechte für diesen Befehl!`)
  }
}