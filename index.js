var spawn = require("child_process").spawn;
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Discord bot implements
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
var mcServer;
var lastMsgTime = 0;

const prefix = process.env.prefix;
const token = process.env.bot_token;
const mc_pas = process.env.mcServer_pass;

client.on("ready", () => {
  client.channels.cache.get("1160762387230638151").send("起動しました！");

  console.log("Botを起動しました!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("McControl$")) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command == "start") {
    console.log("🔄️BOTを起動中です...");
    // Only start if not running
    if (mcServer == null) {
      if (client.uptime - lastMsgTime < 0) {
        console.log("Potential command spamming by " + message.author.username);
        message.channel.send(
          "Last command was less than 60 seconds ago. Try again in a minute, " +
            message.author.username +
            "."
        );
      } else {
        lastMsgTime = client.uptime;

        message.channel.send(
          "Starting Minecraft server. This will take a minute or so."
        );

        // Start the server
        mcServer = spawn(mc_pas);

        mcServer.stdout.on("data", function (data) {
          console.log("stdout: " + data);

          let data_string = new TextDecoder().decode(data);
          message.channel.send("stdout: " + data_string.substring(0, 500));

          if (data.includes("Closing Server")) {
            kill(mcServer.pid);
            mcServer = null;
          }
        });

        mcServer.on("close", function (code) {
          console.log("child process exited with code " + code);
          message.channel.send(
            "Minecraft server has been closed. (Code: " + code + ")"
          );

          // Stop the server
          if (mcServer != null) {
            mcServer.stdin.setEncoding("utf-8");
            mcServer.stdin.write("stop\n");
            mcServer.stdin.end();
          }

          mcServer = null;
        });
      }
    } else {
      message.channel.send("Minecraft server is already running.");
    }
  } else if (command == "stop") {
    if (client.uptime - lastMsgTime < 0) {
      console.log("Potential command spamming by " + message.author.username);
      message.channel.send(
        "Last command was less than 60 seconds ago. Try again in a minute, " +
          message.author.username +
          "."
      );
    } else {
      lastMsgTime = client.uptime;

      // Only stop if running
      if (mcServer != null) {
        message.channel.send("Force-stopping Minecraft server...");

        // Stop the server
        mcServer.stdin.setEncoding("utf-8");
        mcServer.stdin.write("stop\n");
        mcServer.stdin.end();

        mcServer = null;
      }
    }
  }
});

client.login(token);
