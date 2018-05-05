var readline = require('readline')
var jsonfile = require('jsonfile')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('\nWhat would you like the prefix of the commands to be? (Example: "!", no quotation marks!)\n> ', (prefix) => {
  rl.question('\nWho is/are the owner/s of the bot? Seperate with a space!\n> ', (owners) => {
    let ownersArr = owners.split(' ')
    rl.question('\nWhat is your Riot Games API key?\n> ', (apiKey) => {
      rl.question('\nWhat is your Riot Games API endpoint?\n> ', (apiEndpoint) => {
        rl.question('\nWhat is the username of your bot?\n> ', (botUser) => {
          rl.question('\nWhat is the password/oauth token of your bot?\n> ', (botPass) => {
            rl.question('\nIn what channels do you want the bot? Seperate with a space!\n> ', (botChannels) => {
              let channelsArr = botChannels.split(' ')
              rl.question(`\nWe are about to create a config with the following settings:\n> Prefix: ${prefix}\n> Bot Owners: ${ownersArr}\n> Riot Games API Key: ${apiKey}\n> API Endpoint: ${apiEndpoint}\n> Bot Username: ${botUser}\n> Bot Password: ${botPass}\n> Channels: ${channelsArr}\n\nDo you confirm these settings? Type YES or NO.\n> `, (confirmation) => {
                if (confirmation.toLowerCase() == 'yes') {
                  console.log('\n\nGenreating config.json...')
                  rl.close()

                  var file = './config.json'
                  var obj = {

                    "bot": {
                      "prefix": prefix,
                      "version": "2.1",
                      "messagePrefix": "» ",
                      "developers": ownersArr
                    },

                    "league": {
                      "apiKey": apiKey,
                      "apiEndpoint": apiEndpoint,
                      "gameVersion": "8.9.1"
                    },

                    "twitch": {
                      "username": botUser,
                      "password": botPass,
                      "channels": channelsArr
                    }

                  }

                  jsonfile.writeFile(file, obj, {
                    spaces: 2
                  }, (err) => {
                    if (!err) {
                      console.error('Done! You can now customize your own commands in the commands-folder and events in events-folder! After that, spin up the bot via: node index')
                    }
                  })

                } else {
                  console.log('\n\nIt was worth trying, I guess!')
                }
              })
            })
          })
        })
      })
    })
  })
})