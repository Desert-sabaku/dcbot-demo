import { SlashCommandBuilder } from "discord.js";

import type { Command } from "../types/command";

export const pingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Botの応答速度を確認します"),
    async execute(interaction, client) {
        const latency = Date.now() - interaction.createdTimestamp;
        const wsPing = client.ws.ping;

        await interaction.reply(
            `🏓 Pong!\nAPI Latency: ${latency}ms\nWS Ping: ${wsPing}ms`,
        );
    },
};
