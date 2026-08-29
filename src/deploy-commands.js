import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const commands = [
  new SlashCommandBuilder()
    .setName("vouch")
    .setDescription("Ask for a vouch")
    .toJSON(),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
  console.log(`Registering ${commands.length} slash command(s)...`);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });
  console.log("Slash commands registered successfully.");
} catch (error) {
  console.error(error);
}
