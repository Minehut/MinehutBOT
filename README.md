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
  - Anti-spam moderation
  - Anti-bot moderation
- Boosterpass tracking
- Custom permission levels
- Tags
- Built-in documentation
- Role announcements
- Minehut commands

## Usage

In order to self-host this project, you need a local instance of MongoDB running as well as your own Sentry account. As of right now, you also need to edit the guild configuration in the codebase in order for the bot to work properly in your guild. After you've sufficed these requirements, simply fill out the values in `.env.example` and change it to `.env` and start the bot with `yarn start`.

## Contributing

We always welcome contributions to the bot, just simply make a pull request.

## Credits

@jellz - Made this README with modification from @Facto
