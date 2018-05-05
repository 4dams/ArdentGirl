exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  if (userstate.mod || developers.includes(userstate.username)) {
    if (!args || args.length < 1) {
      client.say(channel, messagePrefix + `Fehler: Es muss ein Command angegeben werden!`)
    } else {
      delete require.cache[require.resolve(`./${args[0]}.js`)]
      client.say(channel, messagePrefix + `Command !${args[0]} wurde erfolgreich neugeladen.`)
    }
  } else {
    client.say(channel, messagePrefix + `Tut mir Leid, du hast leider keine Rechte für diesen Befehl!`)
  }
}