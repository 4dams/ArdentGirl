![Preview](http://i.4da.ms/cmwYGZ.gif)

# TwitchBot
This is my small personal Twitch-Bot which I run on my own Twitch account.
- [Twitch](https://twitch.tv/mr4dams)
- Website/Command lists (WIP!)
- Latest Release (WIP!)  
  
It got some nice features such as informational commands, fun commands and even League of Legends related commands which grant you a lot of information about a specific Summoner!  
  
*Just a quick note: You will need a [Riot Games API Key](https://developer.riotgames.com) in order to use the League commands!*

## Available Commands

### League Commands
- [X] "!elo" sends current league information about the streamer
- [X] "!winrate" calculates a users current winrate and then sends it in chat
- [X] "!topchamps" displays a summoners top 3 champions (name, level and mastery score)
- [X] "!rank1" shows some info about the defined servers Rank 1 Challenger
- [X] "!status" provides a list of League's server status and warning, if there are any
- [X] "!livegame" displays info about the streamers current game (runes wip)


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
- [ ] "!setsummoner" to save info about a channels default summoner

*Note: Those commands have been adjusted for one special streamer but you can change and adjust them as much as you want, even though they're in german.*

## To Do

- Split commands into single files

## Installation

```
// Tmi.js
npm i tmi.js

// Moment.js
npm i moment

// Request
npm i request
```

Other than that, you will have a file called "config.json" where you can set all your information such as:  
  
1. Your Riot API token
2. Your Twitch OAuth token
3. Channel names
  
The Riot API token can be retrieved at https://developer.riotgames.com/.</br>
Your Twitch OAuth token can be found at https://twitchapps.com/tmi/.</br>
  
You will then have to fill in your tokens and other information into the `config.json`.
  
After you have done that, you can simply start the bot with `node app.js` in the directory where the app.js is located in!

## Disclaimer

>4dams' TwitchBot isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
