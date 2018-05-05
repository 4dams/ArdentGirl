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
    let rankRequest = "https://" + apiEndpoint + ".api.riotgames.com/lol/" + "league/v3/positions/by-summoner/" + obj.id + "?api_key=" + apiKey

    request(rankRequest, (error, response, body) => {
      let obj = JSON.parse(body)
      if (response.statusCode !== 200) {
        client.say(channel, messagePrefix + `Entschuldigung, ich konnte leider keine Daten abfragen! Fehler: ${response.statusCode}`)
      } else {
        if (!obj[0] == 0) {
          let elo = normalize(obj[0].tier)
          client.say(channel, messagePrefix + `${obj[0].playerOrTeamName} ist momentan ${elo} ${obj[0].rank} mit ${obj[0].leaguePoints} LP.`)
        } else {
          client.say(channel, messagePrefix + `${target} ist momentan Unranked.`)
        }
      }
    })
  })
}

function normalize(string) {
  let str = string.toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}