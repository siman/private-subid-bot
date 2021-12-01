import { Telegraf, Scenes } from 'telegraf'
import { CustomTelegrafContext } from './types'
import { confirmAccountScene } from './scenes/AuthScene'
import { TOKEN } from './utils/env'
import { menuScene } from './scenes/MenuScene'
import { startBot, stopBot } from './utils/index'
import { resolveChainsInfo } from './resolvers/resolveChainInfo'
import { menuKeyboard } from './utils/buttons'
import { adminPanelSceneName, adminPanelScene } from './scenes/AdminPanel'
import { checkNetworks, MINUTE } from './jobs'
import { adminsArray } from './utils/env'

const LocalSession = require('telegraf-session-local')

export const bot = new Telegraf<CustomTelegrafContext>(TOKEN)

const stage = new Scenes.Stage([
	confirmAccountScene,
	menuScene,
	adminPanelScene,
])
const localSession = new LocalSession()

bot.use(localSession.middleware())
bot.use(stage.middleware())

bot.start(async (ctx) => {
	await startBot(ctx)
})

bot.command('menu', async (ctx) => {
	const address = ctx.session.address

	address &&
		(await ctx.reply('Choose one of the buttons in the menu ⬇', menuKeyboard))
})

bot.hears('Start', async (ctx) => {
	await startBot(ctx)
})

const { enter } = Scenes.Stage
bot.command('apanel', enter<CustomTelegrafContext>(adminPanelSceneName))

bot.on('new_chat_members', async (ctx) => {
	await ctx.telegram.leaveChat(ctx.chat.id)
})

bot.launch().catch(console.error)

bot.catch((err: any, ctx) =>
	console.error(`Oops, encountered an error for ${ctx.updateType}`, err)
)

resolveChainsInfo()
const setIntervalKey = setInterval(
	() => checkNetworks(adminsArray),
	30 * MINUTE
)

process.once('SIGINT', () => stopBot('SIGINT', setIntervalKey))
process.once('SIGTERM', () => stopBot('SIGTERM', setIntervalKey))
