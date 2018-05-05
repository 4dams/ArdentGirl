exports.run = (client, channel, username, viewers, autohost) => {
  if (autohost) {
    client.say(channel, messagePrefix + `Vielen Dank für deinen Autohost, ${username}! SeemsGood`)
  } else {
    client.say(channel, messagePrefix + `${username} schickt uns seine ${viewers} Zuschauer vorbei! PogChamp`)
  }
}