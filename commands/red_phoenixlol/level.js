var request = require('request')

exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  let target

  if (!args[0] == 0) {
    target = args.join(' ')
  } else {
    target = 'GG RedPhoenix'
  }

  let idRequest = "https://" + apiEndpoint + ".api.riotgames.com/lol/" + "summoner/v3/summoners/by-name/" + target + "?api_key=" + apiKey
  request(idRequest, (error, response, body) => {
    if (response.statusCode !== 200) {
      client.say(channel, messagePrefix + `Entschuldigung, ich konnte leider keine Daten abfragen! Fehler: ${response.statusCode}`)
    }
    let obj = JSON.parse(body)
    let statRequest = "https://" + apiEndpoint + ".api.riotgames.com/lol/" + "summoner/v3/summoners/" + obj.id + "?api_key=" + apiKey
    request(statRequest, (error, response, body) => {
      let obj = JSON.parse(body)
      if (response.statusCode !== 200) {
        client.say(channel, messagePrefix + `Entschuldigung, ich konnte leider keine Daten abfragen! Fehler: ${response.statusCode}`)
      } else {
        client.say(channel, messagePrefix + `${obj.name} ist im Moment Level ${obj.summonerLevel}.`)
      }
    })
  })
}