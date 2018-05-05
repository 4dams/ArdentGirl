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
      return
    }
    let obj = JSON.parse(body)
    let champRequest = "https://" + apiEndpoint + ".api.riotgames.com/lol/" + "champion-mastery/v3/champion-masteries/by-summoner/" + obj.id + "?api_key=" + apiKey
    request(champRequest, (error, response, body) => {

      if (response.statusCode !== 200 || !body) {
        client.say(channel, messagePrefix + `Entschuldigung, ich konnte leider keine Daten abfragen! Fehler: ${response.statusCode}`)
      } else {
        let obj = JSON.parse(body)
        client.say(channel, messagePrefix + `${target} bester Champion ist ${getChampionName(obj[0].championId)} - ${getChampionTitle(obj[0].championId)} (Level ${obj[0].championLevel} | ${numberize(obj[0].championPoints)} Pkt.), gefolgt von ${getChampionName(obj[1].championId)} (Level ${obj[1].championLevel} | ${numberize(obj[1].championPoints)} Pkt.) und ${getChampionName(obj[2].championId)} (Level ${obj[2].championLevel} | ${numberize(obj[2].championPoints)} Pkt.)`)
      }
    })
  })

  function getChampionName(id) {
    for (var i in champList) {
      if (champList[i].key == id) {
        return champList[i].id
      }
    }
  }

  function getChampionTitle(id) {
    for (var i in champList) {
      if (champList[i].key == id) {
        return champList[i].title
      }
    }
  }

  function numberize(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

}