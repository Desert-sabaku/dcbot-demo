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

const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
    process.env.GEMINI_API_KEY;

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

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "echo") {
        let message = interaction.options.getString("message", true);
        if (interaction.options.getBoolean("is_reversed")) {
            message = message.split("").reverse().join("");
        }
        await interaction.reply(`📢 ${message}`);
    }
});

type GeminiGenerateContentResponse = {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
};

const askGemini = async (question: string): Promise<string> => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
        }),
    });

    const parsedResponse =
        (await response.json()) as GeminiGenerateContentResponse;
    const data = parsedResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!data) {
        throw new Error("Gemini API response does not contain text");
    }
    return data;
};

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ask") {
        await interaction.deferReply(); // 長時間かかる処理の前に返信を保留する
        const question = interaction.options.getString("question", true);
        try {
            let answer = await askGemini(question);

            // 浄化処理：Discordのメッセージ制限に合わせて、回答を切り詰める
            const characterLimit = 2000;
            if (answer.length > characterLimit) {
                const suffix = "（以下略）";
                answer = `${Array.from(answer)
                    .slice(0, characterLimit - suffix.length)
                    .join("")}${suffix}`;
            }

            await interaction.editReply(`🤖 ${answer}`);
        } catch (error) {
            console.error("Error asking Gemini:", error);
            await interaction.editReply(
                "申し訳ありませんが、質問の処理中にエラーが発生しました。",
            );
        }
    }
});

// Botをログインさせる
client.login(process.env.DISCORD_TOKEN);
