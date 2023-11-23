//パッケージの指定
var spawn = require("child_process").spawn;
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
require("dotenv").config();
const util = require("util");
const wait = util.promisify(setTimeout);
const fs = require("fs");
const kill = require("tree-kill");

// Discord.jsパッケージの初期設定
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

//設定ファイルの取得
const config = JSON.parse(fs.readFileSync("./config.json"));

//マイクラサーバー管理用変数の初期設定
var mcServer;
var lastMsgTime = 0;
//その他変数初期設定
const token = process.env.bot_token;
const userIDs = config.controllable_user_IDs;
const BEserver = config.BE_server;
const prefix = config.prefix;
const consoleChannelID = config.console_channel_ID;

client.on("ready", () => {
  setInterval(
    () =>
      client.user.setActivity({
        name: `所属サーバー数は${client.guilds.cache.size} | McCon$startで開始。McCon$stopで停止。`,
        type: ActivityType.Watching,
      }),
    10000
  );

  client.channels.cache.get(consoleChannelID).send("起動しました！");
  console.log("Botを起動しました!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (userIDs.includes(message.author.id)) {
    if (message.channel.id == consoleChannelID) {
      if (command == "start") {
        console.log("🔄️BOTを起動中です...");
        // Only start if not running
        if (mcServer == null) {
          if (client.uptime - lastMsgTime < 0) {
            console.log(
              `${message.author.username}より、スパムの可能性のあるメッセージを受信しました。`
            );
            message.channel.send(
              "このコマンドは、スパムの可能性があるメッセージとして感知されました。数分後にもう一度お試しください。"
            );
          } else {
            lastMsgTime = client.uptime;

            message.channel.send(
              "マイクラサーバーを起動します。しばらくお待ちください。"
            );

            // Start the server
            let mc_pas = BEserver
              ? "./minecraft_server_data/bedrock_server.exe"
              : "./minecraft_server_data/run.bat";
            mcServer = spawn(mc_pas);

            mcServer.stdout.on("data", function (data) {
              console.log("From MCserver: " + data);

              let data_string = new TextDecoder().decode(data);
              message.channel.send(
                `\`\`\`\n${data_string.substring(0, 500)}\n\`\`\``
              );

              if (data.includes("Closing Server")) {
                kill(mcServer.pid);
                mcServer = null;
              }
            });

            mcServer.on("close", function (code) {
              console.log(`子プロセスを終了コード${code}で終了しました。`);
              message.channel.send(
                "マイクラサーバーを停止しました。 (終了コード: " + code + ")"
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
          message.channel.send("マイクラサーバーは既に稼働中です。");
        }
      } else if (command == "command") {
        if (client.uptime - lastMsgTime < 0) {
          console.log(
            `${message.author.username}より、スパムの可能性のあるメッセージを受信しました。`
          );
          message.channel.send(
            "このコマンドは、スパムの可能性があるメッセージとして感知されました。数分後にもう一度お試しください。"
          );
        } else {
          lastMsgTime = client.uptime;

          // Only run if running
          if (mcServer != null) {
            mcServer.stdin.setEncoding("utf-8");
            mcServer.stdin.write(args.toString());
            mcServer.stdin.end();
          }
        }
      } else if (command == "stop") {
        if (client.uptime - lastMsgTime < 0) {
          console.log(
            `${message.author.username}より、スパムの可能性のあるメッセージを受信しました。`
          );
          message.channel.send(
            "このコマンドは、スパムの可能性があるメッセージとして感知されました。数分後にもう一度お試しください。"
          );
        } else {
          lastMsgTime = client.uptime;

          // Only stop if running
          if (mcServer != null) {
            message.channel.send("マイクラサーバーに停止信号を送信中...");

            // Stop the server
            mcServer.stdin.setEncoding("utf-8");
            mcServer.stdin.write("stop\n");
            mcServer.stdin.end();

            mcServer = null;
          }
        }
      } else if (command == "KILL SERVER") {
        if (client.uptime - lastMsgTime < 0) {
          console.log(
            `${message.author.username}より、スパムの可能性のあるメッセージを受信しました。`
          );
          message.channel.send(
            "このコマンドは、スパムの可能性があるメッセージとして感知されました。数分後にもう一度お試しください。"
          );
        } else {
          lastMsgTime = client.uptime;
          // Only stop if running
          if (mcServer != null) {
            message.channel.send("サーバーを強制停止中…");
            kill(mcServer.pid);

            mcServer = null;
          }
        }
      }
    } else {
      let rep = message.reply(`<#${consoleChannelID}> で実行してください。`);
      await wait(7500);
      (await rep).delete();
      message.delete();
    }
  } else {
    let rep = message.reply(
      "申し訳ございません。このBOTのコマンドは このBOTのオーナーが設定したユーザーのみが使用できます。詳細は、このBOTを導入したユーザーにお尋ねください。\n※あなたがBOTを導入したユーザーの場合は、__**[サポートサーバー](https://discord.gg/uYYaVRuUuJ)**__よりお尋ねください。"
    );
    await wait(7500);
    (await rep).delete();
    message.delete();
  }
});

client.login(token);
