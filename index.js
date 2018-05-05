var tmi = require("tmi.js")
var moment = require("moment")
var fs = require("fs")
var jsonfile = require("jsonfile")
var request = require("request")
var winston = require("winston")

var config = require("./config.json")

var client = new tmi.client({
  "options": {
    "debug": false
  },
  "connection": {
    "reconnect": true
  },
  "identity": {
    "username": config.twitch.username,
    "password": config.twitch.password
  },
  "channels": config.twitch.channels
})

var startTime = moment()
var version = config.bot.version
var totalCommands = 0
var messagePrefix = config.bot.messagePrefix
var developers = config.bot.developers
var apiKey = config.league.apiKey
var apiEndpoint = config.league.apiEndpoint
var lolVersion = config.league.gameVersion
var champList

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      'timestamp': true
    }),
    new(winston.transports.File)({
      filename: 'process.log'
    })
  ]
})

function getChampionList() {
  request('http://ddragon.leagueoflegends.com/cdn/' + lolVersion + '/data/de_DE/champion.json', (error, response, body) => {
    var list = JSON.parse(body)
    champList = list.data
    logger.log(`info`, ` Global | Champion List Loaded`)
  })
}

getChampionList()

client.on("chat", (channel, userstate, message, self) => {
  if (self) return

  if (message.indexOf(config.bot.prefix) !== 0) return

  let args = message.slice(config.bot.prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  try {
    let commandFile = require(`./commands/${channel.split('#')[1]}/${command}.js`)
    logger.log(`info`, ` ${channel.split('#')[1]} | Command Used | ${config.bot.prefix}${command}`)
    commandFile.run(client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList)
    totalCommands++
  } catch (err) {
    logger.log(`info`, `${err}`)
  }

})

client.on("cheer", (channel, userstate, message) => {
  try {
    let eventFile = require(`./events/${channel.split('#')[1]}/cheer.js`)
    logger.log(`info`, ` ${channel.split('#')[1]} | Cheer Event`)
    eventFile.run(client, channel, userstate, message)
  } catch (err) {
    logger.log(`info`, `${err}`)
  }
})

client.on("hosted", (channel, username, viewers, autohost) => {
  try {
    let eventFile = require(`./events/${channel.split('#')[1]}/hosted.js`)
    logger.log(`info`, ` ${channel.split('#')[1]} | Host Event`)
    eventFile.run(client, channel, username, viewers, autohost)
  } catch (err) {
    logger.log(`info`, `${err}`)
  }
})

client.on("resub", (channel, username, months, message, userstate, methods) => {
  try {
    let eventFile = require(`./events/${channel.split('#')[1]}/resub.js`)
    logger.log(`info`, ` ${channel.split('#')[1]} | Resub Event`)
    eventFile.run(client, channel, username, months, message, userstate, methods)
  } catch (err) {
    logger.log(`info`, `${err}`)
  }
})

client.on("subscription", (channel, username, method, message, userstate) => {
  try {
    let eventFile = require(`./events/${channel.split('#')[1]}/subscription.js`)
    logger.log(`info`, ` ${channel.split('#')[1]} | Subscription Event`)
    eventFile.run(client, channel, username, method, message, userstate)
  } catch (err) {
    logger.log(`info`, `${err}`)
  }
})

client.connect()