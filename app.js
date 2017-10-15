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

  // Chat Event
  client_twitch.on("chat", (channel, user, message, self) => {

    if(channel == "#followredphoenix") {

      // Elo Command
      if(message.toLowerCase().includes("!elo")) {
        if(self) return
        api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313')
          .then(data => {
            let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
            client_twitch.action(channel, '[🤖] ' + entry.playerOrTeamName + ' ist momentan ' + entry.tier + ' ' + entry.rank + ' mit ' + entry.leaguePoints + ' LP. Schreibe "!winrate" in den Chat, für mehr Informationen!');
        });
        console.log("[" + moment().format('LTS') + "] Elo requested in " + channel + "!")
      }

      // Summoner ID
      if(message.toLowerCase().includes("!summoner")) {
        if(self) return
        api.get('euw1', 'summoner.getBySummonerName', 'YuRedPhoenix')
          .then(data => client_twitch.action(channel, "[🤖] Die Summoner ID von " + data.name + " lautet " + data.id + '.'));
      }

      // Winrate Command
      if(message.toLowerCase().includes("!winrate")) {
        if(self) return
        api.get('euw1', 'league.getAllLeaguePositionsForSummoner', '95457313')
        .then(data => {
          let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
          var q_wins = entry.wins
          var q_losses = entry.losses
          var q_winrate = q_wins / (q_wins + q_losses) * 100
          var q_winrate_rounded = Math.round(q_winrate * 100) / 100
          client_twitch.action(channel, "[🤖] Yu RedPhoenix hat eine Winrate von " + q_winrate_rounded + "%. (" + q_wins + " W / " + q_losses + " L)")
        });
      }

      // Top Champion Command - Broken
      if(message.toLowerCase().includes("!topchamp")) {
        if(self) return
        api.get('euw1', 'championMastery.getAllChampionMasteries', '95457313')
        .then(data => {
          let entry2 = data.find(e2 => e2.championId === '40');
          var champ1_points = entry2.championPoints
          var champ1_level = entry2.championLevel
          client_twitch.action(channel, "[🤖] Yu RedPhoenix' bester Champion ist Janna mit Championlevel " + champ1_level + " und " + champ1_points + " Masterypoints.")
        });
      }

      // Command Lists
      if(message.toLowerCase().includes("!commands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Verfügbare Commands: !elo, !winrate, !topchamp, !myelo, !commands.")
        client_twitch.action(channel, "[🤖] Weitere Commands für Moderatoren und Subs können abgerufen werden mit !modcommands und !subcommands.")
      }

      if(message.toLowerCase().includes("!modcommands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Verfügbare Commands für Moderatoren: !purge <user>, !exit, ")
      }

      if(message.toLowerCase().includes("!subcommands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Subcommands folgen noch.")
      }

      // Purge Command
      if(message.toLowerCase().includes("!purge")) {
        if(self) return
        if(user.mod) {
          var words = message.split(' ');
          var purge_target = words[1];
          var command_user = user.username
          client_twitch.timeout(channel, purge_target, 1, "Purge command used my moderator " + command_user + "!")
          client_twitch.action(channel, "[🤖] Die letzten Nachrichten von " + purge_target + " wurden erfolgreich entfernt.")
        }
      }

      if(message.toLowerCase().includes("!myelo")) {
        const elos = [
          "Bronze 5 BibleThump",
          "Bronze 4 BibleThump",
          "Bronze 3 BibleThump",
          "Bronze 2 BibleThump",
          "Bronze 1 BibleThump",
          "Silver 5 WutFace",
          "Silver 4 WutFace",
          "Silver 3 WutFace",
          "Silver 2 WutFace",
          "Silver 1 WutFace",
          "Gold 5 ResidentSleeper",
          "Gold 4 ResidentSleeper",
          "Gold 3 ResidentSleeper",
          "Gold 2 ResidentSleeper",
          "Gold 1 ResidentSleeper",
          "Platinum 5 4Head",
          "Platinum 4 4Head",
          "Platinum 3 4Head",
          "Platinum 2 4Head",
          "Platinum 1 4Head",
          "Diamond 5 BigBrother",
          "Diamond 4 BigBrother",
          "Diamond 3 BigBrother",
          "Diamond 2 BigBrother",
          "Diamond 1 BigBrother",
          "Master PogChamp",
          "Challenger Keepo"]
          client_twitch.say(channel, `@` + user.username + ` ist gerade mal ${elos[Math.floor(elos.length * Math.random())]}`)
      }

    }

  });

  // Cheer Event
  client_twitch.on("cheer", function (channel, userstate, message) {
      if(channel == "#followredphoenix") {
        client_twitch.say(channel, "Vielen Dank für deine " + user.bits + " Bits, " + user.username "! PogChamp")
      }
  });

  // Subscription Event
  client_twitch.on("subscription", function (channel, username, method, message, userstate) {
    if(channel == "#followredphoenix") {
      client_twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen Sub!")
    }
  });

  // Resub Event
  client_twitch.on("resub", function (channel, username, months, message, userstate, methods) {
    if(channel == "#followredphoenix") {
      client_twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen " + months + "-Monate Resub!")
    }
  });

  // Hosting Event
  client_twitch.on("hosted", function (channel, username, viewers, autohost) {
      if(channel == "#followredphoenix") {
        client_twitch.say(channel, "PogChamp Danke für deinen Host, " + username + "! Deine " + viewers + " Zuschauer sind sehr willkommen! <3")
      }
  });
