exports.run = (client, channel, userstate, message) => {
  client.say(channel, messagePrefix + `Vielen Dank für deine ${userstate.bits} Bits, ${userstate['display-name']}! PogChamp`)
}