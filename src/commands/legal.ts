import type ApplicationCommand from './ApplicationCommand'
import localizations, { getLocalization } from '../localizations'

const l10n = localizations.commands.legal

const command: ApplicationCommand = {
  meta: {
    name: getLocalization(l10n.name),
    name_localizations: l10n.name,
    description: getLocalization(l10n.description),
    description_localizations: l10n.description,
    options: []
  },
  execute: async interaction => {
    await interaction.reply({
      content: getLocalization(l10n.content, interaction.locale, {
        terms: 'https://github.com/gimjb/create-vc-bot/blob/master/.github/terms.md',
        privacy: 'https://github.com/gimjb/create-vc-bot/blob/master/.github/privacy.md'
      }),
      ephemeral: true
    })
  }
}

export default command
