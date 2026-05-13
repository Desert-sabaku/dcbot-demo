import { Client, GatewayIntentBits } from "discord.js";

// Botのインスタンスを作成
// 特権ゲートウェイのインテントを明示的にしておく必要がある。
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // サーバーに関する基本情報の受信
        GatewayIntentBits.GuildMessages, // メッセージ受信の許可
        GatewayIntentBits.MessageContent, // メッセージ内容の読み取り許可
    ],
});

// Botが準備完了した時に一度だけ実行される
client.once("clientReady", () => {
    console.log(`${client.user?.tag} がオンラインになりました！🚀`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        // APIレイテンシは、命令が届いてからBotが動作するまでの時間。
        const latency = Date.now() - interaction.createdTimestamp;

        // WSピンは、BotとDiscordサーバー間のWebSocket接続の遅延時間。
        const wsPing = client.ws.ping;

        await interaction.reply(
            `🏓 Pong!\nAPI Latency: ${latency}ms\nWS Ping: ${wsPing}ms`,
        );
    }
});

// Botをログインさせる
client.login(process.env.DISCORD_TOKEN);
