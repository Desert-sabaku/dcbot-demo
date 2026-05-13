import { askCommand } from "./ask";
import { echoCommand } from "./echo";
import { pingCommand } from "./ping";

import type { Command } from "../types/command";

export const commands: Command[] = [pingCommand, echoCommand, askCommand];

export const commandMap = new Map(
    commands.map((command) => [command.data.name, command]),
);

export const commandData = commands.map((command) => command.data.toJSON());
