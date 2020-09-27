# MinehutBOT

This is the source code of the Discord bot used on the official Minehut Discord server.

## Features

- Reaction roles
- Powerful per-guild configuration
- Extensive moderation suite
  - Infraction/case management and tracking
  - Comprehensive logging
  - Advanced message cleaning
  - Punishment commands
  - Customisable chat filter
  - Anti-spam
  - Anti-bot
- Boosterpass tracking
- Custom permission levels
- Tags
- Built-in documentation
- Role announcements
- Minehut commands

## Usage

### Requirements

- A local instance of MongoDB
- (optional) A Sentry account
- (optional but recommended) Yarn

### Steps

1. Install all dependencies with `yarn` or `npm install`.
2. Fill out all values in `.env.example` and change it to `.env`.
3. In order for the bot to work properly on your guild, you need to add it to the bot's hard-coded [guild configuration](https://github.com/Minehut/MinehutBOT/blob/master/src/guild/config/guildConfigs.ts).
4. Start the bot with `yarn start` or `npm start`.

## Contributing

We always welcome contributions to the bot, just simply make a pull request.

## Credits

[jellz](https://github.com/jellz) - Made this README with modification from [Facto](https://github.com/Sniped)
