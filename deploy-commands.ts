import { REST, Routes } from "discord.js";

// 1. 登録したいコマンドの定義
const commands = [
    {
        name: "ping",
        description: "Botの応答速度を確認します",
    },
];

// 2. RESTの準備
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

// 3. 登録の実行
const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

(async () => {
    try {
        console.log("スラッシュコマンドの登録を開始します...");

        // 特定のサーバー（ギルド）に対してコマンドを登録
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log("スラッシュコマンドの登録に成功しました！🎉");
    } catch (error) {
        console.error("登録中にエラーが発生しました:\n", error);
    }
})();
