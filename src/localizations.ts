import type { LocaleString } from 'discord.js'

export type LocalizationItem<L extends LocaleString = 'en-US'> =
& { [K in LocaleString]?: string }
& { [K in L | 'en-US']-?: string }

export const localizations = {
  boolean: {
    true: {
      da: 'ja',
      'en-US': 'yes'
    },
    false: {
      da: 'nej',
      'en-US': 'no'
    }
  },
  errors: {
    notVoiceChannel: {
      da: 'Du skal vælge en stemmekanal.',
      'en-US': 'You must choose a voice channel.'
    }
  },
  commands: {
    legal: {
      name: {
        da: 'juridisk',
        'en-US': 'legal'
      },
      description: {
        da: 'Få et link til servicevilkårene og privatlivspolitikken.',
        'en-US': 'Get a link to the terms of service and privacy policy.'
      },
      content: {
        da: 'Links til botens juridiske dokumenter:\n- [Servicevilkår]({{terms}})\n- [Privatlivspolitik]({{privacy}})',
        'en-US': 'Links to the bot’s legal documents:\n- [Terms of Service]({{terms}})\n- [Privacy Policy]({{privacy}})'
      }
    },
    vc: {
      name: {
        'en-US': 'vc'
      },
      description: {
        da: 'Konfigurer en stemmekanal, der opretter en midlertidig bruger-ejet VC ved tilslutning.',
        'en-US': 'Configure a voice channel to create a temporary user-owned VC upon joining.'
      },
      set: {
        name: {
          da: 'indstil',
          'en-US': 'set'
        },
        description: {
          da: 'Konfigurer stemmekanal.',
          'en-US': 'Set voice channel configuration.'
        },
        content: {
          da: 'Når en bruger tilslutter {{channel}}, oprettes en ny stemmekanal. Når alle brugere forlader den nye kanal, slettes den.',
          'en-US': 'When a user joins {{channel}}, a new voice channel will be created. When all users leave the new channel, it will be deleted.'
        },
        channel: {
          name: {
            da: 'kanal',
            'en-US': 'channel'
          },
          description: {
            da: 'Stemmekanalen, der skal indstilles.',
            'en-US': 'The voice channel to configure.'
          }
        }
      },
      unset: {
        name: {
          da: 'nulstil',
          'en-US': 'unset'
        },
        description: {
          da: 'Nulstil stemmekanal-konfigurationen, sluk for funktionen.',
          'en-US': 'Reset the voice channel configuration, turning off the feature.'
        },
        content: {
          da: 'Når en bruger tilslutter {{channel}}, oprettes der ikke længere en ny stemmekanal.',
          'en-US': 'When a user joins {{channel}}, a new voice channel will no longer be created.'
        },
        channel: {
          name: {
            da: 'kanal',
            'en-US': 'channel'
          },
          description: {
            da: 'Stemmekanalen, der skal nulstilles.',
            'en-US': 'The voice channel to unset.'
          }
        }
      }
    }
  }
}

/**
 * Get the `'en-US'` localization of an item.
 *
 * @param item The item to localize.
 * @returns The `'en-US'` localization of the item.
*/
export function getLocalization<L extends 'en-US' = 'en-US'> (
  item: LocalizationItem<L>
): string
/**
 * Get the localization of an item.
 *
 * @param item The item to localize.
 * @param locale The locale to use.
 * @returns The localization of the item.
*/
export function getLocalization<L extends LocaleString = 'en-US'> (
  item: LocalizationItem<L>,
  locale: LocaleString
): string
/**
 * Get the localization of an item with replacements.
 *
 * @param item The item to localize.
 * @param locale The locale to use.
 * @param keys The keys to replace.
 * @returns The localization of the item with replacements.
*/
export function getLocalization<L extends LocaleString = 'en-US'> (
  item: LocalizationItem<L>,
  locale: LocaleString,
  keys: Record<string, string | number | boolean>
): string
export function getLocalization<L extends LocaleString = 'en-US'> (
  item: LocalizationItem<L>,
  locale: LocaleString = 'en-US',
  keys: Record<string, string | number | boolean> = {}
): string {
  let localizedItem = item[locale] ?? item['en-US']

  for (const key in keys) {
    const value = keys[key]
    const replacement = typeof value === 'boolean'
      ? getLocalization<'da'>(localizations.boolean[value ? 'true' : 'false'], locale)
      : keys[key]?.toString() ?? ''

    localizedItem = localizedItem.replaceAll(`{{${key}}}`, replacement)
  }

  return localizedItem
}

export default localizations
