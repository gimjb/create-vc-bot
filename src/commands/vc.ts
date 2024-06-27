import discord from 'discord.js'
import type ApplicationCommand from './ApplicationCommand'
import localizations, { getLocalization } from '../localizations'
import Guild from '../models/Guild'

const l10n = localizations.commands.vc

const command: ApplicationCommand = {
  meta: {
    name: getLocalization(l10n.name),
    name_localizations: l10n.name,
    description: getLocalization(l10n.description),
    description_localizations: l10n.description,
    default_member_permissions: discord.PermissionFlagsBits.ManageChannels.toString(),
    options: [
      {
        type: discord.ApplicationCommandOptionType.Subcommand,
        name: getLocalization(l10n.set.name),
        name_localizations: l10n.set.name,
        description: getLocalization(l10n.set.description),
        description_localizations: l10n.set.description,
        options: [
          {
            type: discord.ApplicationCommandOptionType.Channel,
            name: getLocalization(l10n.set.channel.name),
            name_localizations: l10n.set.channel.name,
            description: getLocalization(l10n.set.channel.description),
            description_localizations: l10n.set.channel.description,
            required: true
          }
        ]
      },
      {
        type: discord.ApplicationCommandOptionType.Subcommand,
        name: getLocalization(l10n.unset.name),
        name_localizations: l10n.unset.name,
        description: getLocalization(l10n.unset.description),
        description_localizations: l10n.unset.description,
        options: [
          {
            type: discord.ApplicationCommandOptionType.Channel,
            name: getLocalization(l10n.unset.channel.name),
            name_localizations: l10n.unset.channel.name,
            description: getLocalization(l10n.unset.channel.description),
            description_localizations: l10n.unset.channel.description,
            required: true
          }
        ]
      }
    ]
  },
  async execute (interaction) {
    const subcommand = interaction.options.getSubcommand(true)
    const channel = interaction.options.getChannel('channel', true)

    if (channel.type !== discord.ChannelType.GuildVoice) {
      await interaction.reply({
        content: getLocalization(localizations.errors.notVoiceChannel, interaction.locale),
        ephemeral: true
      })
    }

    switch (subcommand) {
      case 'set':
        await (await Guild.get(interaction.guildId as string)).addCreateChannel(channel.id)
        await interaction.reply({
          content: getLocalization(l10n.set.content, interaction.locale, { channel: `<#${channel.id}>` }),
          ephemeral: true
        })
        break
      case 'unset':
        await (await Guild.get(interaction.guildId as string)).removeCreateChannel(channel.id)
        await interaction.reply({
          content: getLocalization(l10n.unset.content, interaction.locale, { channel: `<#${channel.id}>` }),
          ephemeral: true
        })
        break
    }
  }
}

export default command
