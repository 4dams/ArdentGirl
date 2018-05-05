 https: //decapi.me/twitch/followage/:channel/:user

   var request = require('request')

 exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
   let target

   if (!args[0] == 0) {
     target = args.join(' ')
   } else {
     target = userstate.username
   }

   let requestMap = `https://decapi.me/twitch/followage/${channel.split('#')[1]}/${target}?precision=7`
   request(requestMap, (error, response, body) => {
     if (response.statusCode !== 200) {
       client.say(channel, messagePrefix + `Entschuldigung, ich konnte leider keine Daten abfragen!`)
     } else {
       client.say(channel, messagePrefix + `${target} folgt ${channel.split('#')[1]} schon seit ${body}.`)
     }
   })
 }