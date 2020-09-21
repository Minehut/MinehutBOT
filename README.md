# MinehutBOT

Minehut's Discord Bot.

## How to Use

Click [here](https://docs.google.com/document/d/1pInCGtGXnRHMrhpowZ-to6eDUyWm2kRgeChlMvpCzfM) to view a document containing all of the commands and the required permissions.

## Setting up the Config

Inside the config.json lies multiple options that can be configured. These are all required for full functionality of the bot.

| Config Value | What its for                                              |
|--------------|-----------------------------------------------------------|
| token        | Discord Bot's private token                               |
| prefix       | Prefix of all the Bot commands                            |
| devs         | List of developers of the Bot with additional permissions |
| guildid      | ID of the Discord server the bot is for                   |
| logchannel   | Channel to log all misc staff messages to                 |
| rolechannel  | Channel to look for react messages to give roles for      |
| muterole     | ID of the role to give to players on mute                 |
| hsemojiid    | ID of the hypesquad emoji to react with                   |
| db           | RethinkDB database info to store punishments and more     |

## How to Setup

1. Install all of the dependencies by typing ``npm install``

2. Copy the ``config-example.json`` file into a new file called ``config.json`` and change settings accordingly.

3. Start the bot by typing ``node minehut.js``

