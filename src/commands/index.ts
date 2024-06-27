import fs from 'fs'
import discord from 'discord.js'
import log from '@gimjb/log'
import type ApplicationCommand from './ApplicationCommand'
import type {
  ApplicationCommandStructure,
  CommandAutocomplete,
  CommandLogic,
  CommandOnLoad,
  RestCommandReturn
} from './ApplicationCommand'

const commandsMetadata: ApplicationCommandStructure[] = []
const commandsLogic: Record<string, CommandLogic> = {}
const commandsOnLoad: CommandOnLoad[] = []
const commandsAutocomplete: Record<string, CommandAutocomplete> = {}

const files = fs.readdirSync(__dirname)

async function loadCommandsFromFiles (): Promise<void> {
  for (const file of files) {
    if (
      !file.endsWith('.js') ||
      file === 'index.js' ||
      file === 'ApplicationCommand.js'
    ) {
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`./${file}`).default as ApplicationCommand

    commandsMetadata.push({ contexts: [0], ...command.meta })
    commandsLogic[command.meta.name] = command.execute
    if (typeof command.onLoad === 'function') {
      commandsOnLoad.push(command.onLoad)
    }
    if (typeof command.autocomplete === 'function') {
      commandsAutocomplete[command.meta.name] = command.autocomplete
    }
  }
}

loadCommandsFromFiles().catch(log.error)

/** All application commands. */
export default {
  /** Metadata of all application commands. */
  metadata: commandsMetadata,
  /** Logic of all application commands. */
  logic: commandsLogic,
  /** Register all application commands to Discord. */
  register: async (client: discord.Client<true>) => {
    const rest = new discord.REST({ version: '10' }).setToken(client.token)

    const commands = await rest.put(discord.Routes.applicationCommands(client.user.id), {
      body: commandsMetadata
    }) as RestCommandReturn

    void log.info('Successfully registered application commands.')

    for (const onLoad of commandsOnLoad) {
      onLoad(commands)
    }
  },
  /** Handle any command interaction. */
  handle: async (interaction: discord.ChatInputCommandInteraction | discord.AutocompleteInteraction) => {
    const command =
      interaction.isAutocomplete()
        ? commandsAutocomplete[interaction.commandName]
        : commandsLogic[interaction.commandName]

    if (typeof command === 'undefined') return

    try {
      await command(interaction as any)
    } catch (error) {
      void log.error(error)

      if (!interaction.isChatInputCommand()) return

      interaction.reply({
        content: ':x: Something went wrong. Try again.',
        ephemeral: true
      }).catch(log.error)
    }
  }
} as const
