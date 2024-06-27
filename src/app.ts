import discord from 'discord.js'
import 'dotenv/config'
import log from '@gimjb/log'
import mongoose from 'mongoose'
import commands from './commands'
import config from './config'
import Guild from './models/Guild'

mongoose
  .connect(process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/create-vc-bot')
  .then(async () => {
    void log.info('Connected to MongoDB.')
    await Guild.getAll()
    void log.info('Cached all guild configurations.')
  })
  .catch(async error => {
    await log.error(error)
    process.exit(1)
  })

const client = new discord.Client({
  intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates'],
  presence: {
    activities: [
      {
        name: `/vc | v${process.env['npm_package_version'] ?? '?.?.?'}`
      }
    ]
  }
})

client.on('error', message => { void log.error(message) })
client.on('warn', message => { void log.warn(message) })
client.on('shardError', (error, shardId) => {
  void log.error(`Shard ${shardId} encountered an error:`)
  void log.error(error)
})

client.on('ready', readyClient => {
  void log.info(`Logged in as ${readyClient.user.tag ?? 'unknown'}.`)
  void commands.register(readyClient)

  // for (const guild of await guildsController.getAll()) {
  //   readyClient.channels.fetch(guild.channelId).then(channel => {
  //     if (channel === null || !channel.isVoiceBased()) return

  //     joinVC(
  //       channel.id,
  //       channel.guildId,
  //       channel.guild.voiceAdapterCreator
  //     )
  //   }).catch(log.error)
  // }
})

client.on('guildCreate', guild => {
  guild.members.fetchMe().then(member => {
    member.setNickname(config.nickname).catch(log.error)
  }).catch(log.error)
})

async function voiceStateUpdate (oldState: discord.VoiceState, newState: discord.VoiceState): Promise<void> {
  const guild = await Guild.get(newState.guild.id)

  if (guild.create.includes(newState.channelId ?? '')) {
    const channel = await newState.guild.channels.create({
      name: `${newState.member?.user.username ?? 'unknown'}’s VC`,
      type: discord.ChannelType.GuildVoice,
      parent: newState.channel?.parent ?? null,
      permissionOverwrites: [
        ...(newState.channel?.permissionOverwrites.cache.values() ?? []),
        {
          id: newState.member?.id ?? '',
          allow: [
            discord.PermissionFlagsBits.ManageChannels,
            discord.PermissionFlagsBits.ManageRoles,
            discord.PermissionFlagsBits.UseVAD,
            discord.PermissionFlagsBits.PrioritySpeaker,
            discord.PermissionFlagsBits.MuteMembers,
            discord.PermissionFlagsBits.DeafenMembers,
            discord.PermissionFlagsBits.MoveMembers
          ]
        }
      ]
    })

    await newState.setChannel(channel)
    await guild.addRemoveEmpty(channel.id)
  }

  if (guild.removeEmpty.includes(oldState.channelId ?? '')) {
    const channel = await oldState.channel?.fetch()

    if (channel?.members.size === 0) {
      await channel.delete()
      await guild.removeRemoveEmpty(channel.id)
    }
  }
}

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceStateUpdate(oldState, newState).catch(log.error)
})

client.on('shardDisconnect', (closeEvent, shardId) => {
  void log.warn(`Shard ${shardId} disconnected with code ${closeEvent.code}.`)

  void client.shard?.respawnAll()
})

client.on('interactionCreate', interaction => {
  if (!interaction.isChatInputCommand()) return

  void commands.handle(interaction)
})

client.login(process.env['DISCORD_TOKEN']).catch(log.error)
