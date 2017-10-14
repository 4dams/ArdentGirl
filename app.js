// Dependencies

var tmi = require('tmi.js');
var moment = require('moment');
const TeemoJS = require('teemojs');
let api = TeemoJS('YOUR_RIOT_API_KEY_HERE');


// Optionen

var options = {
  options: {
    debug: false
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: "mr4dams",
    password: "YOUR_TWITCH_OAUTH_TOKEN_HERE"
  },
  channels: ["#mr4dams", "#followredphoenix"]
}


// Twitch bot verbinden

var client_twitch = new tmi.client(options);
client_twitch.connect();


// Connected?

client_twitch.on("connected", function (address, port) {
    console.log("[" + moment().format('LTS') + "] Twitch client connected!")
});


// Events

client_twitch.on("chat", (channel, user, message, self) => {

  if(channel == "#followredphoenix") {

    if(message.toLowerCase().includes("!elo")) {

      api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313') // ID of Summoner "Yu RedPhoenix"
        .then(data => {
          let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5'); // Queue Type
          client_twitch.action('#followredphoenix', '[🤖] ' + entry.playerOrTeamName + ' ist momentan ' + entry.tier + ' ' + entry.rank + ' mit ' + entry.leaguePoints + ' LP. Schreibe "!winrate" in den Chat, für mehr Informationen!');
      });

      console.log("[" + moment().format('LTS') + "] Elo requested in " + channel + "!")
    }

    if(message.toLowerCase().includes("!summoner")) {

      api.get('euw1', 'summoner.getBySummonerName', 'YuRedPhoenix')
        .then(data => client_twitch.action("#followredphoenix", "[🤖] Die Summoner ID von " + data.name + " lautet " + data.id + '.'));

      console.log("[" + moment().format('LTS') + "] Summoner requested in " + channel + "!")
    }

    if(message.toLowerCase().includes("!winrate")) {

      api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313') // ID of Summoner "Yu RedPhoenix"
      .then(data => {
        let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5'); // Queue Type
        
        // Calculating the winrate... Split up to simplify
        var q_wins = entry.wins
        var q_losses = entry.losses

        var q_winrate = q_wins / (q_wins + q_losses) * 100
        var q_winrate_rounded = Math.round(q_winrate * 100) / 100 // Rounding up winrate

        client_twitch.action("#followredphoenix", "[🤖] Yu RedPhoenix hat eine Winrate von " + q_winrate_rounded + "%. (" + q_wins + " W / " + q_losses + " L)")

      });

    }

  }

});
