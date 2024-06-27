import mongoose, { Model, Schema, type HydratedDocument } from 'mongoose'

export interface GuildCreateChannel {
  /** The voice channel's Discord ID. */
  channelId: string
  /** The format of the new channel's name. */
  nameFormat: string
}

export interface GuildDoc {
  /** The guild's Discord ID. */
  _id: string
  /** Voice channels users can join to create a new voice channel. */
  create: string[]
  /** Voice channels to remove when empty. */
  removeEmpty: string[]
}

/** A guild document with methods. */
export type HydratedGuildDoc = HydratedDocument<GuildDoc, GuildMethods>

/** A guild collection with static methods. */
export interface GuildModel extends Model<GuildDoc, {}, GuildMethods>, GuildStatics {}

const guildSchema = new Schema<GuildDoc, GuildModel, GuildMethods, {}, {}, GuildStatics>({
  _id: { type: String, required: true },
  create: { type: [String], default: [] },
  removeEmpty: { type: [String], default: [] }
})

export interface GuildMethods {
  /**
   * Sets a voice channel for users to join to create a new voice channel.
   *
   * @param channelId The voice channel's Discord ID.
   * @returns The updated guild document.
   */
  addCreateChannel: (this: HydratedGuildDoc, channelId: string) => Promise<HydratedGuildDoc>
  /**
   * Removes a voice channel for users to join to create a new voice channel.
   *
   * @param channelId The voice channel's Discord ID.
   * @returns The updated guild document.
   */
  removeCreateChannel: (this: HydratedGuildDoc, channelId: string) => Promise<HydratedGuildDoc>
  /**
   * Adds a voice channel to remove when empty.
   *
   * @param channelId The voice channel's Discord ID.
   * @returns The updated guild document.
   */
  addRemoveEmpty: (this: HydratedGuildDoc, channelId: string) => Promise<HydratedGuildDoc>
  /**
   * Removes a voice channel to remove when empty.
   *
   * @param channelId The voice channel's Discord ID.
   * @returns The updated guild document.
   */
  removeRemoveEmpty: (this: HydratedGuildDoc, channelId: string) => Promise<HydratedGuildDoc>
}

guildSchema.method({
  // eslint-disable-next-line no-template-curly-in-string
  async addCreateChannel (channelId: string) {
    const channel = this.create.find(id => id === channelId)

    if (typeof channel === 'undefined') {
      this.create.push(channelId)
      await this.save()
    }

    return await this.save()
  },
  async removeCreateChannel (channelId: string) {
    this.create = this.create.filter(id => id !== channelId)
    return await this.save()
  },
  async addRemoveEmpty (channelId: string) {
    this.removeEmpty.push(channelId)
    return await this.save()
  },
  async removeRemoveEmpty (channelId: string) {
    this.removeEmpty = this.removeEmpty.filter(id => id !== channelId)
    return await this.save()
  }
})

export interface GuildStatics {
  /**
   * Retrieves a guild document by its Discord ID.
   *
   * @param _id The guild's Discord ID.
   * @returns The guild document.
   */
  get: (this: GuildModel, _id: string) => Promise<HydratedGuildDoc>
  /**
   * Retrieves all guild documents.
   *
   * @returns The guild documents.
   */
  getAll: (this: GuildModel) => Promise<HydratedGuildDoc[]>
}

const cache = new Map<string, HydratedGuildDoc>()
guildSchema.static({
  async get (_id: string) {
    // Retrieve the guild from the database in case it was updated outside of the bot.
    const promise = this.findById(_id).exec().then(guild => {
      if (guild !== null) cache.set(_id, guild)
      return guild
    })

    // For performance, return the cached guild if it exists.
    if (cache.has(_id)) return cache.get(_id) as HydratedGuildDoc

    // If the guild is not cached, retrieve it from the database and cache it.
    const guild: HydratedGuildDoc = await promise ?? await new this({ _id }).save()
    cache.set(_id, guild)

    return guild
  },
  async getAll () {
    const guilds = await this.find().exec()

    // Cache all guilds for performance.
    for (const guild of guilds) cache.set(guild._id, guild)

    return guilds
  }
})

/** A Discord guild. */
export default mongoose.model<GuildDoc, GuildModel>('Guild', guildSchema)
