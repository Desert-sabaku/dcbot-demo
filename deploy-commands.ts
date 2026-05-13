import { REST, Routes } from "discord.js";

import { commandData } from "./src/commands";
import { requireEnv } from "./src/config/env";

const token = requireEnv("DISCORD_TOKEN");
const clientId = requireEnv("CLIENT_ID");
const guildId = requireEnv("GUILD_ID");

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("スラッシュコマンドの登録を開始します...");

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandData,
        });

        console.log("スラッシュコマンドの登録に成功しました！🎉");
    } catch (error) {
        console.error("登録中にエラーが発生しました:\n", error);
    }
})();
