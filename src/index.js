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

const READY_TIMEOUT_MS = 30_000;
const readyWatchdog = setTimeout(() => {
  console.error(`Did not receive clientReady within ${READY_TIMEOUT_MS}ms, exiting so the host can restart us`);
  process.exit(1);
}, READY_TIMEOUT_MS);

client.once("clientReady", () => {
  clearTimeout(readyWatchdog);
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("error", (err) => console.error("Client error:", err));
client.on("shardError", (err) => console.error("Shard error:", err));
client.on("shardDisconnect", (event, id) => console.warn(`Shard ${id} disconnected:`, event.code, event.reason));
client.on("shardReconnecting", (id) => console.warn(`Shard ${id} reconnecting...`));
client.on("shardResume", (id) => console.log(`Shard ${id} resumed`));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "vouch") return;

  console.log(`Received /vouch from ${interaction.user.tag} at ${new Date().toISOString()}`);

  try {
    await interaction.reply(`please vouch <@${interaction.user.id}> in <#${VOUCH_CHANNEL_ID}>`);
    console.log("Replied successfully");
  } catch (err) {
    console.error("Failed to reply to /vouch:", err);
  }
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("Login failed:", err);
});
