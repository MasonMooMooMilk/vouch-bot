import { createServer } from "node:http";
import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("vouch-bot is running");
}).listen(PORT, () => console.log(`Health check server listening on port ${PORT}`));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const VOUCH_CHANNEL_ID = "1395917117945151769";

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "vouch") return;

  await interaction.reply(`please vouch <@${interaction.user.id}> in <#${VOUCH_CHANNEL_ID}>`);
});

client.login(process.env.DISCORD_TOKEN);
