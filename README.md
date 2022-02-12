# Discord Bot Framework

> _This template is originally forked from [gonzyui/Discord-Template-V13](https://github.com/gonzyui/Discord-Template-V13/)_ > _Make sure to check that out for the full version!_

## Introduction

This template offers more of **intellisense** or what we call in common words, **Auto Complete**. I made this template for all the beginners out there trying to make a Discord Bot. I have credited the main owner's repository so make sure to check that out before checking out this!

## Prerequisites

- [nodejs v16+](https://nodejs.org/)
- [discord.js v13+](https://npmjs.com/package/discord.js)
- [moment](https://npmjs.com/package/moment)
- [dotenv](https://npmjs.com/package/dotenv)
- [chalk](https://npmjs.com/package/chalk)
- [@discordjs/rest](https://npmjs.com/package/@discordjs/rest)
- [discord-api-types](https://npmjs.com/package/discord-api-types)

To install all of them, run the below script in your console:

```js
npm install discord.js moment dotenv chalk @discordjs/rest discord-api-types
```

## Almost Done!

- Make sure to rename the `.env.example` to `.env` and fill it in.
- Follow this command template always!

```js
const Command = require("../../structures/Command")

module.exports = class Test extends Command {
  constructor(client){
    super(client. {
      name: "test",
      description: "Test Cmd"
    })
  }

  async exec(message, args){
    const pong = this.client.ws.ping;
    message.reply(`Hi ${args}, ${pong}ms`)
  }
}
```

## Contribution

I may or may not have made a few errors but all of you are free to **fork** this repository and create a [pull request](https://github.com/Dqrshan/Bot-Framework/pulls)

## Contact Me

<table>
  <tr>
    <td align="center"><a href="https://discord.com/users/838620835282812969"><img src="https://cdn.discordapp.com/avatars/838620835282812969/c0b6981060e40b82fcacf52f9c16c049.png" width="100px">
    <br />
      <sub>
        <b>Lorenz#1337</b>
      </sub>
    </a>
  </tr>
</table>
