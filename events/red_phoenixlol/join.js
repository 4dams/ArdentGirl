let greeters = [
  'HeyGuys',
  'VoHiYo',
  'Guten Tag,'
  'Hallöchen,',
  'Kappa //'
]

exports.run = (client, channel, username, self) => {
  if (!self) {
    client.say(channel, messagePrefix + `${greeters[Math.floor(responses.length * Math.random())]} ${username}!`)
  }
}