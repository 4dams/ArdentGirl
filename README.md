# TwitchBot ![PogChamp](https://i.imgur.com/2AEkqhC.gif)
This is my small personal Twitch-Bot which I run on my own Twitch account.</br>
</br>
It got some nice features such as informational commands, fun commands and even League of Legends related commands which grant you a lot of information about the Streamer's Summoner!</br>
</br>
*Just a quick note: You will need a [Riot Games API Key](https://developer.riotgames.com) in order to use the League commands!*

# Available Commands

### Riot API Commands *(require Riot API)*
- [X] **"!elo" sends current league information about the streamer**
- [X] **"!winrate" calculates a users current winrate and then sends it in chat**
- [ ] **"!checkelo `<summoner>`" lets you check the elo of a specific summoner**
- [ ] **"!checkwinrate `<summoner>`" shows you the winrate of a specific summoner**
- [ ] **"!spell `<summoner spell name>`" gives you information about a summoner spell**


### Default Commands
- [X] "!commands" to get a list of all commands
- [X] "!info" gives some info about the bot itself
- [X] "!myelo" a fun command which returns a random elo
- [X] "!zeit" sends the streamers current time
- [X] "!8ball" for responding with a random string (yes/no/maybe...)
- [X] "!vanish" to remove all messages from yourself
- [ ] "!addcommand `<trigger> <response>`" lets you add a new command via chat
- [ ] "!chatstats" or "!emotestats" to see how much a specific emote/string has been used
- [ ] "!permit" permit users to post links (the bot will otherwise delete all links)

*Note: Those commands have been adjusted for one special streamer but you can change and adjust them as much as you want, even though they're in german.*

# To Do

- "getSummonerIds" with forEach
- fix "!topchamp" command
- add commands from list
- translate main commands into english
- split commands into seperate file like Nami

# Installation

To run this bot, you have to have [Node.js](https://nodejs.org/en/) installed on the machine you're running the bot on. Other than that, you will need a few modules. There's a list of all modules below.

```
// Tmi.js
npm i tmi.js

// Moment.js
npm i moment

// TeemoJS
npm i teemojs
```

Other than that, you will have to adjust some options in the main bot file. </br>
</br>
1. Your Riot API token
2. Your Twitch OAuth token
</br>
The Riot API token can be retrieved at https://developer.riotgames.com/.</br>
Your Twitch OAuth token can be found at https://twitchapps.com/tmi/.</br>
</br>
You will then have to fill in your Riot API token in line 6 and your Twitch username and OAuth token in line 21 and 22.
</br>
After you have done that, you can simply start the bot with `node app.js` in the directory where the app.js is located in!
