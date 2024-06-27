import type discord from 'discord.js'
import type { LocalizationItem } from '../localizations'

/**
 * An option choice for an application command.
 *
 * @see [Discord's documention](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure)
 */
interface ApplicationCommandOptionChoiceStructure {
  name: string
  name_localizations: LocalizationItem
  value: string | number
}

/**
 * An option for an application command.
 *
 * @see [Discord's documention](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
 */
export interface ApplicationCommandOptionStructure {
  /** Type of option. */
  type: number
  /** 1-32 character name. */
  name: string
  /**
   * Localization dictionary for the `name` field. Values follow the same
   * restrictions as `name`.
   *
   * @default null
   */
  name_localizations?: LocalizationItem | null
  /** 1-100 character description. */
  description: string
  /**
   * Localization dictionary for the `description` field. Values follow the same
   * restrictions as `description`.
   *
   * @default null
   */
  description_localizations?: LocalizationItem | null
  /**
   * Whether the option is required.
   *
   * @default true
   */
  required?: boolean
  /**
   * Choices for `string` and `number` types for the user to pick from; max 25.
   *
   * @default []
   */
  choices?: ApplicationCommandOptionChoiceStructure[]
  /**
   * If the option is a subcommand or subcommand group type, these nested
   * options will be the parameters.
   *
   * @default []
   */
  options?: ApplicationCommandOptionStructure[]
  /** If the option is a channel type, the channels shown will be restricted to these types. */
  channel_types?: number[]
  /** If the option is a `number` type, the minimum value permitted. */
  min_value?: number
  /** If the option is a `number` type, the maximum value permitted. */
  max_value?: number
  /** For option type `string`, the minimum allowed length (minimum of `0`, maximum of `6_000`). */
  min_length?: number
  /** For option type `string`, the maximum allowed length (minimum of `1`, maximum of `6_000`). */
  max_length?: number
  /**
   * Whether autocomplete interactions are enabled for this `string` or `number`
   * type option.
   *
   * `autocomplete` may not be set to true if `choices` are present.
   *
   * @default false
   */
  autocomplete?: boolean
}

/**
 * An application command.
 *
 * @see [Discord's documention](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
 */
export interface ApplicationCommandStructure {
  /**
   * Type of command.
   *
   * @default 1
   */
  type?: number
  /** 1-32 character name. */
  name: string
  /**
   * Localization dictionary for the `name` field. Values follow the same
   * restrictions as `name`.
   *
   * @default null
   */
  name_localizations?: LocalizationItem | null
  /** 1-100 character description. */
  description: string
  /**
   * Localization dictionary for the `description` field. Values follow the same
   * restrictions as `description`.
   *
   * @default null
   */
  description_localizations?: LocalizationItem | null
  /**
   * The parameters for the command; max 25.
   *
   * @default []
   */
  options?: ApplicationCommandOptionStructure[]
  /** Set of permissions represented as a bit set (default: all). */
  default_member_permissions?: string | null
  /**
   * Interaction context(s) where the command is available.
   *
   * @default [0, 1, 2]
   */
  contexts?: number[] | null
}

interface RestCommandOption {
  [key: string]: unknown
}

export type RestCommandReturn = Array<{
  id: string
  application_id: string
  version: string
  default_member_permissions: unknown
  type: number
  name: string
  name_localization: LocalizationItem | null
  description: string
  description_localization: LocalizationItem | null
  dm_permission: boolean
  contexts: number[]
  integration_types: number[]
  options?: RestCommandOption[]
  nsfw: false
  [key: string]: unknown
}>

/** A function to be called once the command is executed. */
export type CommandLogic<Args extends any[] = unknown[]> = (interaction: discord.ChatInputCommandInteraction, ...args: Args) => Promise<unknown>

/** A function to be called when the command or its options are autocompleted. */
export type CommandAutocomplete = (interaction: discord.AutocompleteInteraction) => Promise<unknown>

/** A function to be called once all commands have been registered. */
export type CommandOnLoad = (commands: RestCommandReturn) => void

/** An application command. */
export default interface ApplicationCommand<Args extends any[] = unknown[]> {
  /** The metadata of the application command. */
  meta: ApplicationCommandStructure
  /** The logic of the application command. */
  execute: CommandLogic<Args>
  /** A function to be called once all commands have been registered. */
  onLoad?: CommandOnLoad
  /** A function to be called when the command or its options are autocompleted. */
  autocomplete?: CommandAutocomplete
}
