require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');

if (!process.env.DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN is missing. Create .env from .env.example.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Check bot latency.'),
  new SlashCommandBuilder().setName('zyvora').setDescription('Show Team Zyvora status.'),
  new SlashCommandBuilder().setName('help').setDescription('Show available Team Zyvora commands.')
].map(command => command.toJSON());

client.once(Events.ClientReady, async ready => {
  console.log(`Discord bot online as ${ready.user.tag}`);
  try {
    if (process.env.DISCORD_CLIENT_ID) {
      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
      await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
      console.log('Global slash commands registered.');
    } else {
      console.log('DISCORD_CLIENT_ID not set; slash-command registration skipped.');
    }
  } catch (error) {
    console.error('Slash command registration failed:', error.message);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
  }
  if (interaction.commandName === 'zyvora') {
    return interaction.reply('⚡ Team Zyvora is online. Website + Discord services are running.');
  }
  if (interaction.commandName === 'help') {
    return interaction.reply('**Team Zyvora commands**\n`/ping` — bot latency\n`/zyvora` — service status\n`/help` — this menu');
  }
});

client.on(Events.Error, console.error);
client.login(process.env.DISCORD_TOKEN);
