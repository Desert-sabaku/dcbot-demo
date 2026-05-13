import { Client, GatewayIntentBits } from "discord.js";

import { requireEnv } from "./src/config/env";
import { registerEvents } from "./src/events/register-events";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

registerEvents(client);

client.login(requireEnv("DISCORD_TOKEN"));
