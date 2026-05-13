import { Events, type Client } from "discord.js";

import { commandMap } from "../commands";

export const registerEvents = (client: Client): void => {
    client.once(Events.ClientReady, () => {
        console.log(`${client.user?.tag} がオンラインになりました！🚀`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = commandMap.get(interaction.commandName);

        if (!command) {
            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error("Command execution error:", error);

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content:
                        "コマンド実行中にエラーが発生しました。時間をおいて再度お試しください。",
                    ephemeral: true,
                });
                return;
            }

            await interaction.reply({
                content:
                    "コマンド実行中にエラーが発生しました。時間をおいて再度お試しください。",
                ephemeral: true,
            });
        }
    });
};
