// Config festlegen

var config = require('./config.json');


// Dependencies und modules

var tmi = require('tmi.js');
var moment = require('moment');
var jsonfile = require('jsonfile');
var request = require('request');
var TeemoJS = require('teemojs');
var api = TeemoJS(config.riot_api.token);


// Optionen

var version = "1.1.12"
var game_version = "8.1.1"

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


// Defining Variables

var channel_sid;
var channel_sn;
var prefix = config.channel.prefix;
var api_key = config.riot_api.token;
var championList;

// Twitch bot verbinden

var twitch = new tmi.client(options);
twitch.connect();


// Connected?

twitch.on("connected", function (address, port) {
    console.log("[" + moment().format('LTS') + "] Twitch client connected! requesting summoner ids...")
    getSummonerIds();
    getChampionList();
});


function normalize(string) {
  let str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function numberize(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getQueueName(queueType) {
  if (queueType == "RANKED_SOLO_5x5") {
    return "Solo/Duo"
  } else if (queueType == "RANKED_FLEX_SR") {
    return "Flex 5v5"
  } else if (queueType == "RANKED_FLEX_TT") {
    return "Flex 3v3"
  }
}

function getChampionName(id) {

    for (var i in championList) {

      if (championList[i].key == id) {
        return championList[i].id;
      }

      //console.log(championList[i].id + " | " + championList[i].key);
    }
}

function getChampionTitle(id) {

    for (var i in championList) {

      if (championList[i].key == id) {
        return championList[i].title;
      }

    }
}


// SummonerIDs erfassen

function getSummonerIds() {

    api.get('euw1', 'summoner.getBySummonerName', config.channel.summonername)
    .then(data => {

      channel_sid = data.id
      channel_sn = data.name
      console.log("[" + moment().format('LTS') + "] Summoner ID for " + data.name + " (" + data.id + ") saved successfully.");

    });

}

function getChampionList() {
  request('http://ddragon.leagueoflegends.com/cdn/' + game_version + '/data/de_DE/champion.json', function (error, response, body) {

    var list = JSON.parse(body);
    championList = list.data;

    console.log("[" + moment().format('LTS') + "] Champion list saved successfully.");

  });
}

// Events

  // Chat Event
  twitch.on("chat", (channel, user, message, self) => {

    if(channel == config.channel.name) {

      // Response on bot name
      if(message.toLowerCase().includes("ardentgirl") || message.toLowerCase().includes("ardent girl") || message.toLowerCase().includes("ardentgiri") || message.toLowerCase().includes("ardent giri")) {
        if(self) return

        let responses = [
          "Na, wie geht's? 😘",
          "Wie kann ich dir helfen?",
          "Ich bin kein E-Girl! 😠",
          "Was gibt's? 😏",
          "❤️",
          "😘",
          "💋",
          "Probier's doch mal mit \"!commands\""
        ]

        twitch.say(channel, `${responses[Math.floor(responses.length * Math.random())]}`)
      }

      // Timeout Links
      if(message.toLowerCase().includes("http") || message.toLowerCase().includes(".com")) {
        if (self) return
          if(config.channel.delete_links == false) return
            twitch.timeout(channel, user.username, 1, "Gesendeter Link von " + user.username + " entfernt.")
      }

      // Elo Command
      if(message.toLowerCase().startsWith("!elo")) {
        if(self) return

        let requestMap = "https://euw1.api.riotgames.com/lol/" + "league/v3/positions/by-summoner/" + channel_sid + "?api_key=" + api_key;

        request(requestMap, function (error, response, body) {
          console.log('Error: ', error);
          console.log('StatusCode: ', response && response.statusCode);

          let obj = JSON.parse(body);

          if (response.statusCode !== 200) {
            twitch.action(channel, prefix + "Entschuldigung, ich konnte leider keine Informationen abfragen! (Fehler: " + response.statusCode + ")");
          } else {

            let elo = normalize(obj[0].tier);
            let queue = getQueueName(obj[0].queueType);

            twitch.action(channel, prefix + obj[0].playerOrTeamName + ' ist momentan ' + elo + ' ' + obj[0].rank + ' mit ' + obj[0].leaguePoints + ' LP. (' + queue + ')');
            twitch.action(channel, prefix + ' Für mehr Informationen, probiere es mit !winrate und !topchamps');
          }

          /* ... */

        });
        console.log("[" + moment().format('LTS') + "] Elo requested in " + channel + "!")
      }

      // Summoner command
      if(message.toLowerCase().startsWith("!topchamp") || message.toLowerCase().startsWith("!topchamps")) {
        if(self) return

        let requestMap = "https://euw1.api.riotgames.com/lol/" + "champion-mastery/v3/champion-masteries/by-summoner/" + channel_sid + "?api_key=" + api_key;

        request(requestMap, function (error, response, body) {
          // console.log('Error: ', error);
          // console.log('StatusCode: ', response && response.statusCode);

          if (response.statusCode !== 200) {
            twitch.action(channel, prefix + "Entschuldigung, ich konnte leider keine Informationen abfragen! (Fehler: " + response.statusCode + ")");
          } else {

            let obj = JSON.parse(body);

            let title = getChampionTitle(obj[0].championId);

            let champ1 = getChampionName(obj[0].championId);
            let champ2 = getChampionName(obj[1].championId);
            let champ3 = getChampionName(obj[2].championId);

            let mastery1 = numberize(obj[0].championPoints);
            let mastery2 = numberize(obj[1].championPoints);
            let mastery3 = numberize(obj[2].championPoints);

            let level1 = obj[0].championLevel;
            let level2 = obj[1].championLevel;
            let level3 = obj[2].championLevel;

            twitch.action(channel, prefix + config.channel.summonername + ' bester Champion ist ' + champ1 + ' - ' + title + ' (Level ' + level1 + ' | ' + mastery1 + ' Punkte). Dicht gefolgt von ' + champ2 + ' (Level ' + level2 + ' | ' + mastery2 + ' Punkte) und ' + champ3 + ' (Level ' + level3 + ' | ' + mastery3 + ' Punkte).');

          }

        });

        console.log("[" + moment().format('LTS') + "] Topchamp profile requested in " + channel + "!")
      }

      // Winrate Command
      if(message.toLowerCase().startsWith("!winrate")) {
        if(self) return
        api.get('euw1', 'league.getAllLeaguePositionsForSummoner', channel_sid)
        .then(data => {
          let entry = data.find(e => e.queueType === 'RANKED_SOLO_5x5');
          var q_wins = entry.wins
          var q_losses = entry.losses
          var q_winrate = q_wins / (q_wins + q_losses) * 100
          var q_winrate_rounded = Math.round(q_winrate * 100) / 100
          twitch.action(channel, prefix + entry.playerOrTeamName + " hat eine Winrate von " + q_winrate_rounded + "%. (" + q_wins + " W / " + q_losses + " L)")
          console.log("[" + moment().format('LTS') + "] Winrate requested in " + channel + "!")
        });
      }

      // Info Command
      if(message.toLowerCase().startsWith("!info")) {
        if(self) return
        twitch.action(channel, prefix + "Ardent Girl (Version " + version + ") ist ein selbstersteller Twitch-Bot welcher jede Menge an Informationen sammelt, aktualisiert und wiedergibt. Der Bot kann League-Informationen über einen bestimmten Spieler abrufen, sowie zu einfachen Spaß-Commands reagieren. Schreibe !commands für eine komplette Liste aller Befehle!")
        console.log("[" + moment().format('LTS') + "] Bot-info requested in " + channel + "!")
      }

      // Twitter Command
      if(message.toLowerCase().startsWith("!twitter")) {

        if(self) return
        twitch.action(channel, prefix + "Mehmet's Twitter findest du hier: https://goo.gl/6oKfCv 🐦")
        console.log("[" + moment().format('LTS') + "] Twitter requested in " + channel + "!")
      }

      // Playlist Command
      if(message.toLowerCase().startsWith("!playlist")) {
        if(self) return
        twitch.action(channel, prefix + "Mehmet's aktuelle Playlist findest hier: https://goo.gl/y6DDse 🎶")
        console.log("[" + moment().format('LTS') + "] Playlist requested in " + channel + "!")
      }

      // Tilt Command
      if(message.toLowerCase().startsWith("!tilt")) {
        if(self) return
        twitch.action(channel, prefix + "Ja, Mehmet ist manchmal ein wenig Tilted. Kappa")
        twitch.action(channel, prefix + "Bist jetzt war Mehmet schon " + tilt_count + " Mal tilted.")
        console.log("[" + moment().format('LTS') + "] Tilted requested in " + channel + "!")
      }

      // Command Lists
      if(message.toLowerCase().startsWith("!commands")) {
        if(self) return
        twitch.action(channel, prefix + "Verfügbare Commands: !commands, !elo, !winrate, !topchamps, !info, !myelo, !playlist, !tilt, !twitter, !8ball und !zeit.")
        twitch.action(channel, prefix + "Weitere Commands für Moderatoren und Subs können abgerufen werden mit !modcommands und !subcommands.")
        console.log("[" + moment().format('LTS') + "] Commands requested in " + channel + "!")
      }

      // Moderator Commands
      if(message.toLowerCase().startsWith("!modcommands")) {
        if(self) return
        twitch.action(channel, prefix + "Verfügbare Commands für Moderatoren: !purge <user> und !exit")
        console.log("[" + moment().format('LTS') + "] Modcommands requested in " + channel + "!")
      }

      // Sub Commands
      if(message.toLowerCase().startsWith("!subcommands")) {
        if(self) return
        twitch.action(channel, prefix + "Subcommands folgen noch.")
        console.log("[" + moment().format('LTS') + "] Subcommands requested in " + channel + "!")
      }

      // My Elo Command
      if(message.toLowerCase().startsWith("!myelo")) {
        if(self) return

        let responses = [
          "Bronze 5",
          "Bronze 4",
          "Bronze 3",
          "Bronze 2",
          "Bronze 1",
          "Silver 5",
          "Silver 4",
          "Silver 3",
          "Silver 2",
          "Silver 1",
          "Gold 5",
          "Gold 4",
          "Gold 3",
          "Gold 2",
          "Gold 1",
          "Platinum 5",
          "Platinum 4",
          "Platinum 3",
          "Platinum 2",
          "Platinum 1",
          "Diamond 5",
          "Diamond 4",
          "Diamond 3",
          "Diamond 2",
          "Diamond 1",
          "Master",
          "Challenger"
        ]

        twitch.say(channel, `@` + user.username + ` ist gerade mal ${responses[Math.floor(responses.length * Math.random())]}`)
        console.log("[" + moment().format('LTS') + "] Myelo requested in " + channel + "!")
      }

      // 8ball Command
      if(message.toLowerCase().startsWith("!8ball")) {
        if(self) return

        let responses = [
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

        twitch.action(channel, `[🔮] Die magische Kugel sagt ${responses[Math.floor(responses.length * Math.random())]}`)
        console.log("[" + moment().format('LTS') + "] 8ball requested in " + channel + "!")
      }

      // Vanish Command
      if(message.toLowerCase().startsWith("!vanish")) {
        if(self) return

        var command_user = user.username
        twitch.timeout(channel, command_user, 1, command_user + " hat seine eigenen Nachrichten entfernt.")
        twitch.action(channel, "Huh? Wo ist " + command_user + " hin? 🕵")
        console.log("[" + moment().format('LTS') + "] Vanish requested in " + channel + "!")
      }

      // Purge Command
      if(message.toLowerCase().startsWith("!purge")) {
        if(self) return

        if(user.mod) {
          var words = message.split(' ');
          var purge_target = words[1];
          var command_user = user.username
          twitch.timeout(channel, purge_target, 1, "Alle Nachrichten von " + purge_target + " wurden von " + command_user + " entfernt.")
          twitch.action(channel, prefix + "Die letzten Nachrichten von " + purge_target + " wurden erfolgreich entfernt. ")
          console.log("[" + moment().format('LTS') + "] Purge used in " + channel + "!")
        }
      }

      // Time Command
      if(message.toLowerCase().startsWith("!zeit")) {
        if(self) return
        twitch.action(channel, "Auf meiner Uhr ist es gerade " + moment().format('LTS') + ". 🤔")
        console.log("[" + moment().format('LTS') + "] Zeit requested in " + channel + "!")
      }

    }

  });

  // Cheer Event
  twitch.on("cheer", function (channel, userstate, message) {

    if(channel == config.channel.name) {
      twitch.say(channel, "Vielen Dank für deine " + user.bits + " Bits, " + user.username + "! PogChamp")
      console.log("[" + moment().format('LTS') + "] " + user.bits + " Bits erhalten in " + channel + "!")
    }

  });

  // Subscription Event
  twitch.on("subscription", function (channel, username, method, message, userstate) {

    if(channel == config.channel.name) {
      twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen Sub!")
      console.log("[" + moment().format('LTS') + "] " + username + " hat " + channel + " abonniert!")
    }

  });

  // Resub Event
  twitch.on("resub", function (channel, username, months, message, userstate, methods) {

    if(channel == config.channel.name) {
      twitch.say(channel, "PogChamp " + username + "! Vielen Dank für deinen " + months + "-Monate Resub!")
      console.log("[" + moment().format('LTS') + "] " + username + " hat " + channel + " für " + months + " Monate abonniert!")
    }

  });

  // Hosting Event
  twitch.on("hosted", function (channel, username, viewers, autohost) {

    if(channel == config.channel.name) {
      twitch.say(channel, "PogChamp Danke für deinen Host, " + username + "! Deine " + viewers + " Zuschauer sind sehr willkommen! <3")
      console.log("[" + moment().format('LTS') + "] " + username + " hostet " + channel + " für " + viewers + " Zuschauer!")
    }

  });
