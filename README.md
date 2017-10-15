# TwitchBot
This is my small personal Twitch-Bot which I run on my own Twitch account.</br>
It got some nice features such as informational commands, fun commands and even League of Legends related commands which grant you a lot of information about the Streamer's Summoner!</br>
</br>
*Just a quick note: You will need a [Riot Games API Key](https://developer.riotgames.com) in order to use the League commands!*

# Available Commands

- [X] "!commands" to get a list of all commands
- [X] **"!elo" sends current league information about the streamer** *(requires Riot API)*
- [X] "!info" gives some info about the bot itself
- [X] "!myelo" a fun command which returns a random elo
- [X] "!playlist" sends link to the streamers music playlist
- [X] "!tilt" tells the chat that the streamer gets tilted sometimes
- [X] "!twitter" sends a link to the users twitter account
- [X] **"!winrate" calculates a users current winrate and then sends it in chat** *(requires Riot API)*
- [X] "!zeit" sends the streamers current time

*Note: Those commands have been adjusted for one special streamer but you can change and adjust them as much as you want, even though they're in german.*

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
Your Twitch OAuth token can be found at https://twitchapps.com/tmi/, once you logged in with the account you want to use the bot on.</br>
</br>
You will then have to fill in your Riot API token in **line 6** and your Twitch username and OAuth token in **line 21 and 22**.
</br>
After you have done that, you can simply start the bot with `node app.js` in the directory where the app.js is located in!
