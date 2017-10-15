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

    // Elo Command
    if(message.toLowerCase().includes("!elo")) {
      api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313')
        .then(data => {
          let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
          client_twitch.action('#followredphoenix', '[🤖] ' + entry.playerOrTeamName + ' ist momentan ' + entry.tier + ' ' + entry.rank + ' mit ' + entry.leaguePoints + ' LP. Schreibe "!winrate" in den Chat, für mehr Informationen!');
      });
      console.log("[" + moment().format('LTS') + "] Elo requested in " + channel + "!")
    }

    // Summoner ID
    if(message.toLowerCase().includes("!summoner")) {
      api.get('euw1', 'summoner.getBySummonerName', 'YuRedPhoenix')
        .then(data => client_twitch.action("#followredphoenix", "[🤖] Die Summoner ID von " + data.name + " lautet " + data.id + '.'));
    }

    // Winrate Command
    if(message.toLowerCase().includes("!winrate")) {
      api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313')
      .then(data => {
        let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
        var q_wins = entry.wins
        var q_losses = entry.losses
        var q_winrate = q_wins / (q_wins + q_losses) * 100
        var q_winrate_rounded = Math.round(q_winrate * 100) / 100
        client_twitch.action("#followredphoenix", "[🤖] Yu RedPhoenix hat eine Winrate von " + q_winrate_rounded + "%. (" + q_wins + " W / " + q_losses + " L)")
      });
    }

    // Top Champion Command - Broken
    if(message.toLowerCase().includes("!topchamp")) {
      api.get('euw1', 'championMastery.getAllChampionMasteries', '95457313')
      .then(data => {
        let entry2 = data.find(e2 => e2.championId === '40');
        var champ1_points = entry2.championPoints
        var champ1_level = entry2.championLevel
        client_twitch.action("#followredphoenix", "[🤖] Yu RedPhoenix' bester Champion ist Janna mit Championlevel " + champ1_level + " und " + champ1_points + " Masterypoints.")
      });
    }

    // Command List Command
    if(message.toLowerCase().includes("!commands")) {
      client_twitch.action("#followredphoenix", "[🤖] Verfügbare Commands: !elo, !winrate, !topchamp, !commands.")
    }

  }

});
