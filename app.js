// Config festlegen

var config = require('./config.json');
var summoners = require('./summoners.json');


// Dependencies und modules

var tmi = require('tmi.js');
var moment = require('moment');
const TeemoJS = require('teemojs');
let api = TeemoJS(config.riot_api.token);
var jsonfile = require('jsonfile');


// Optionen

var version = "1.0.49"

var options = {
  options: {
    debug: false
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: config.twitch.username,
    password: config.twitch.password
  },
  channels: config.twitch.channels
}


// Twitch bot verbinden

var client_twitch = new tmi.client(options);
client_twitch.connect();


// Connected?

client_twitch.on("connected", function (address, port) {
    console.log("[" + moment().format('LTS') + "] Twitch client verbunden! Frage SummonerIDs an...")
    //getSummonerIds();
});


// SummonerIDs erfassen

function getSummonerIds() { // I like this function :3

    api.get('euw1', 'summoner.getBySummonerName', config.channels.followredphoenix.summonername)
    .then(data => {

      var file = './summoners.json'
      var obj = {channels: {followredphoenix: {name: data.name, id: data.id}}}

      jsonfile.writeFileSync(file, obj, {flag: 'a', spaces: 2, EOL: '\r\n'});

      //console.log("[" + moment().format('LTS') + "] Summoner ID für " + summoners.followredphoenix.name + " lautet " + summoners.followredphoenix.id + ".")

    });

    api.get('euw1', 'summoner.getBySummonerName', config.channels.mr4dams.summonername)
    .then(data => {

      var file = './summoners.json'
      var obj = {channels: {mr4dams: {name: data.name, id: data.id}}}

      jsonfile.writeFileSync(file, obj, {flag: 'a', spaces: 2, EOL: '\r\n'});

      //console.log("[" + moment().format('LTS') + "] Summoner ID für " + summoners.mr4dams.name + " lautet " + summoners.mr4dams.id + ".")

    });

}


// Events

  // Chat Event
  client_twitch.on("chat", (channel, user, message, self) => {

    if(channel == "#followredphoenix") {

      var channel_summonername = config.channels.followredphoenix.summonername;
      var channel_summonerId = config.channels.followredphoenix.summonerId;

      //  How to get SummonerID by Summoner Name (Just an example)
      //
      //  api.get('euw1', 'summoner.getBySummonerName', 'YuRedPhoenix')
      //    .then(data => console.log(Die Summoner ID von " + data.name + " lautet " + data.id + ".")

      // Timeout Links
      if(message.toLowerCase().startsWith("http")) {
        if (self) return
          if(config.twitch.delete_links == false) return
            client_twitch.timeout(channel, user.username, 1, "Gesendeter Link von " + user.username + " entfernt.")
      }

      // Elo Command
      if(message.toLowerCase().startsWith("!elo")) {
        if(self) return
        api.get('euw1', 'league.getAllLeaguePositionsForSummoner', channel_summonerId)
          .then(infoXD => {
            let entry = infoXD.find(e => e.queueType === 'RANKED_SOLO_5x5');
            client_twitch.action(channel, '[🤖] ' + entry.playerOrTeamName + ' ist momentan ' + entry.tier + ' ' + entry.rank + ' mit ' + entry.leaguePoints + ' LP. Schreibe "!winrate" in den Chat, für mehr Informationen!');
        });
        console.log("[" + moment().format('LTS') + "] Elo requested in " + channel + "!")
      }

      // Winrate Command
      if(message.toLowerCase().startsWith("!winrate")) {
        if(self) return
        api.get('euw1', 'league.getAllLeaguePositionsForSummoner', channel_summonerId)
        .then(data => {
          let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
          var q_wins = entry.wins
          var q_losses = entry.losses
          var q_winrate = q_wins / (q_wins + q_losses) * 100
          var q_winrate_rounded = Math.round(q_winrate * 100) / 100
          client_twitch.action(channel, "[🤖] Yu RedPhoenix hat eine Winrate von " + q_winrate_rounded + "%. (" + q_wins + " W / " + q_losses + " L)")
          console.log("[" + moment().format('LTS') + "] Winrate requested in " + channel + "!")
        });
      }

      // Top Champion Command - Broken
      if(message.toLowerCase().startsWith("!topchamp")) {
        if(self) return
        api.get('euw1', 'championMastery.getAllChampionMasteries', channel_summonerId)
        .then(data => {
          let entry2 = data.find(e2 => e2.championId === '40');
          var champ1_points = entry2.championPoints
          var champ1_level = entry2.championLevel
          client_twitch.action(channel, "[🤖] Yu RedPhoenix' bester Champion ist Janna mit Championlevel " + champ1_level + " und " + champ1_points + " Masterypoints.")
          console.log("[" + moment().format('LTS') + "] Top Champ requested in " + channel + "!")
        });
      }

      // Info Command
      if(message.toLowerCase().startsWith("!info")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Mr4dams' Bot (Version " + version + ") ist ein selbstersteller Twitch-Bot welcher jede Menge an Informationen sammelt, aktualisiert und wiedergibt. Der Bot kann League-Informationen über einen bestimmten Spieler abrufen, sowie zu einfachen Spaß-Commands reagieren. Schreibe !commands für eine komplette Liste aller Befehle!")
        console.log("[" + moment().format('LTS') + "] Bot-info requested in " + channel + "!")
      }

      // Twitter Command
      if(message.toLowerCase().startsWith("!twitter")) {

        if(self) return
        client_twitch.action(channel, "[🤖] Mehmet's Twitter findest du hier: https://goo.gl/6oKfCv 🐦")
        console.log("[" + moment().format('LTS') + "] Twitter requested in " + channel + "!")
      }

      // Twitter Command
      if(message.toLowerCase().startsWith("!playlist")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Mehmet's aktuelle Playlist findest hier: https://goo.gl/y6DDse 🎶")
        console.log("[" + moment().format('LTS') + "] Playlist requested in " + channel + "!")
      }

      // Tilt Command
      if(message.toLowerCase().startsWith("!tilt")) {
        if(self) return
        client_twitch.action(channel, "Ja, Mehmet ist manchmal ein wenig Tilted. Kappa")
        console.log("[" + moment().format('LTS') + "] Tilted requested in " + channel + "!")
      }

      // Command Lists
      if(message.toLowerCase().startsWith("!commands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Verfügbare Commands: !commands, !elo, !info, !myelo, !playlist, !tilt, !twitter, !winrate und !zeit.")
        client_twitch.action(channel, "[🤖] Weitere Commands für Moderatoren und Subs können abgerufen werden mit !modcommands und !subcommands.")
        console.log("[" + moment().format('LTS') + "] Commands requested in " + channel + "!")
      }

      // Moderator Commands
      if(message.toLowerCase().startsWith("!modcommands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Verfügbare Commands für Moderatoren: !purge <user> und !exit")
        console.log("[" + moment().format('LTS') + "] Modcommands requested in " + channel + "!")
      }

      // Sub Commands
      if(message.toLowerCase().startsWith("!subcommands")) {
        if(self) return
        client_twitch.action(channel, "[🤖] Subcommands folgen noch.")
        console.log("[" + moment().format('LTS') + "] Subcommands requested in " + channel + "!")
      }


      // My Elo Command
      if(message.toLowerCase().startsWith("!myelo")) {
        if(self) return
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
          console.log("[" + moment().format('LTS') + "] Myelo requested in " + channel + "!")
      }

      // 8ball Command
      if(message.toLowerCase().startsWith("!8ball")) {
        if(self) return
        const elos = [
          '"Ja!"',
          '"Auf jeden Fall!"',
          '"Natürlich!"',
          '"Eventuell. 🤔"',
          '"Vielleicht."',
          '"Mit großer Wahrscheinlichkeit." Kappa',
          '"Nö."',
          '"Nein."',
          '"Ich glaube nicht."',
          '"Auf keinen Fall" Kappa',
        ]
          client_twitch.say(channel, `[🔮] Die magische Kugel sagt ${elos[Math.floor(elos.length * Math.random())]}`)
          console.log("[" + moment().format('LTS') + "] 8ball requested in " + channel + "!")
      }

      // Vanish Command
      if(message.toLowerCase().startsWith("!vanish")) {
        if(self) return
          var command_user = user.username
          client_twitch.timeout(channel, command_user, 1, command_user + " hat seine eigenen Nachrichten entfernt.")
          client_twitch.action(channel, "Huh? Wo ist " + command_user + " hin? 🕵")
          console.log("[" + moment().format('LTS') + "] Vanish requested in " + channel + "!")
        }
      }

    // Purge Command
    if(message.toLowerCase().startsWith("!purge")) {
      if(self) return
        if(user.mod) {
          var words = message.split(' ');
          var purge_target = words[1];
          var command_user = user.username
          client_twitch.timeout(channel, purge_target, 1, "Alle Nachrichten von " + purge_target + " wurden von " + command_user + " entfernt.")
          client_twitch.action(channel, "[🤖] Die letzten Nachrichten von " + purge_target + " wurden erfolgreich entfernt. ")
          console.log("[" + moment().format('LTS') + "] Purge used in " + channel + "!")
      }
    }

    // Time Command
    if(message.toLowerCase().startsWith("!zeit")) {
      if(self) return
      client_twitch.action(channel, "Auf meiner Uhr ist es gerade " + moment().format('LTS') + ". 🤔")
      console.log("[" + moment().format('LTS') + "] Zeit requested in " + channel + "!")
    }

  });

  // Cheer Event
  client_twitch.on("cheer", function (channel, userstate, message) {
      if(channel == "#followredphoenix") {
        client_twitch.say(channel, "Vielen Dank für deine " + user.bits + " Bits, " + user.username + "! PogChamp")
        console.log("[" + moment().format('LTS') + "] " + user.bits + " Bits erhalten in " + channel + "!")
      }
  });

  // Subscription Event
  client_twitch.on("subscription", function (channel, username, method, message, userstate) {
    if(channel == "#followredphoenix") {
      client_twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen Sub!")
      console.log("[" + moment().format('LTS') + "] " + username + " hat " + channel + " abonniert!")
    }
  });

  // Resub Event
  client_twitch.on("resub", function (channel, username, months, message, userstate, methods) {
    if(channel == "#followredphoenix") {
      client_twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen " + months + "-Monate Resub!")
      console.log("[" + moment().format('LTS') + "] " + username + " hat " + channel + " für " + months + " Monate abonniert!")
    }
  });

  // Hosting Event
  client_twitch.on("hosted", function (channel, username, viewers, autohost) {
      if(channel == "#followredphoenix") {
        client_twitch.say(channel, "PogChamp Danke für deinen Host, " + username + "! Deine " + viewers + " Zuschauer sind sehr willkommen! <3")
        console.log("[" + moment().format('LTS') + "] " + username + " hostet " + channel + " für " + viewers + " Zuschauer!")
      }
  });
