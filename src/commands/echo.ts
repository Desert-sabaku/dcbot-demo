import { SlashCommandBuilder } from "discord.js";

import type { Command } from "../types/command";

export const echoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("指定したメッセージを繰り返します")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("繰り返すメッセージを入力してください")
                .setRequired(true),
        )
        .addBooleanOption((option) =>
            option
                .setName("is_reversed")
                .setDescription("メッセージを逆順に表示しますか？"),
        ),
    async execute(interaction) {
        let message = interaction.options.getString("message", true);

        if (interaction.options.getBoolean("is_reversed")) {
            message = message.split("").reverse().join("");
        }

        await interaction.reply(`📢 ${message}`);
    },
};
