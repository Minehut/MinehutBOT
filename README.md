# MinehutBOT

This is the source code of the Discord bot used on the official Minehut Discord server. This may be outdated as the code used on production is closed-source (boo proprietary).

## Features

- Reaction roles
- Powerful per-guild configuration
- Extensive moderation suite
  - Infraction/case management and tracking
  - Comprehensive logging
  - Advanced message cleaning
  - Punishment commands
  - Customisable chat filter
- Custom permission levels
- Tags
- Built-in documentation
- Role announcements
- Minehut commands

## Usage

At this stage, the bot can't be easily self-hosted and used on your own Discord server. This is because the per-guild configurations are hardcoded, and until these are moved to a database, the only way to practically self-host this bot is by forking/patching the guild configs.

Feel free to add me on Discord (@daniel#0004) if you'd like to discuss this project.

## Future

I want to get the bot to a stage where people can use it on their own servers with no hassle and a largely improved configuration system. I also want to keep adding new features that are useful to communities (e.g. starboard). There may be a web dashboard component in the future, for managing the configuration and other aspects of the bot. This may eventually lead to the bot being centralised instead of having to be self-hosted. A name change will probably be in order too.

## Contributing

3. Start the bot by typing ``node minehut.js``

