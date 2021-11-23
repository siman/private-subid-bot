import { Scenes } from 'telegraf'
import { CustomTelegrafContext } from '../types'
import { isValidAccount } from '../utils/index'
import { menuSceneName } from './MenuScene'
import { cancelButton, startButton, menuKeyboard } from '../utils/buttons';
export const confirmAccountSceneName = 'ConfirmAccountScene'

export const confirmAccountScene = new Scenes.BaseScene<CustomTelegrafContext>(
  confirmAccountSceneName
)

confirmAccountScene.enter((ctx) =>
  ctx.reply(
    'Search by account address (e.g. Polkadot, Kusama, Acala, etc.)',
    cancelButton
  )
)

confirmAccountScene.on('text', async (ctx) => {
  const input = ctx.message.text

  if (input === 'Cancel') {
    const address = ctx.session.address
    await ctx.scene.leave()

    if (address) {
      await ctx.scene.enter(menuSceneName)
    } else {
      await ctx.reply('Canceled', startButton)
    }
    return
  }

  if (!isValidAccount(input)) {
    await ctx.reply('Oops! Account is not valid:')
    return
  }

  await ctx.reply(`Looks like this account is valid 😉`, menuKeyboard)

  ctx.session.address = input

  await ctx.scene.leave()
  await ctx.scene.enter(menuSceneName)
})
