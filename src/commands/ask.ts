import { SlashCommandBuilder } from "discord.js";

import { askGemini } from "../services/gemini";
import type { Command } from "../types/command";

const CHARACTER_LIMIT = 2000;

const truncateForDiscord = (message: string): string => {
    if (message.length <= CHARACTER_LIMIT) {
        return message;
    }

    const suffix = "（以下略）";

    return `${Array.from(message)
        .slice(0, CHARACTER_LIMIT - suffix.length)
        .join("")}${suffix}`;
};

export const askCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Geminiに質問します")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("質問を入力してください")
                .setRequired(true),
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const question = interaction.options.getString("question", true);

        try {
            const answer = await askGemini(question);
            await interaction.editReply(`🤖 ${truncateForDiscord(answer)}`);
        } catch (error) {
            console.error("Error asking Gemini:", error);
            await interaction.editReply(
                "申し訳ありませんが、質問の処理中にエラーが発生しました。",
            );
        }
    },
};
