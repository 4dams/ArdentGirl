exports.run = (client, channel, userstate, message, messagePrefix, startTime, version, totalCommands, developers, apiKey, apiEndpoint, args, champList) => {
  client.say(channel, messagePrefix + `ArdentGirl (v${version}) is a Twitch bot developed by @Mr4dams. Its open sourced code is available online at https://github.com/4dams/. If you have any questions, feel free to ask @Mr4dams`)
}