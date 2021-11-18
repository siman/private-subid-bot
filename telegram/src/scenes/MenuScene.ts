import { Scenes } from 'telegraf'
import { CustomTelegrafContext } from '../types'
import { confirmAccountSceneName } from './AuthScene'
import { sendCrowdloansContributions } from './utils'
import { menuKeyboard as menuKeyboard } from '../utils/buttons'
import { saveCrowdloanInfoToSessionStorage } from '../utils/index';

export const menuSceneName = 'MenuScene'

export const menuScene = new Scenes.BaseScene<CustomTelegrafContext>(
	menuSceneName
)

menuScene.enter(async (ctx) =>
	await ctx.reply('Choose one of the buttons in the menu ⬇', menuKeyboard)
)

menuScene.hears('💰 My Polkadot', async (ctx: CustomTelegrafContext) => {
	const crowdloanStatus = 'all'
	const relayChain = 'polkadot'

	saveCrowdloanInfoToSessionStorage({
		ctx,
		onlyContributed: true,
		relayChain,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(ctx, relayChain, crowdloanStatus, true)
})

menuScene.hears('💰 My Kusama', async (ctx) => {
	const crowdloanStatus = 'all'
	const relayChain = 'kusama'

	saveCrowdloanInfoToSessionStorage({
		ctx,
		onlyContributed: true,
		relayChain,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(ctx, relayChain, crowdloanStatus, true)
})

menuScene.hears('🟢 Active Polkadot', async (ctx) => {
	const crowdloanStatus = 'active'
	const relayChain = 'polkadot'

	saveCrowdloanInfoToSessionStorage({
		ctx,
		onlyContributed: false,
		relayChain,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(ctx, relayChain, crowdloanStatus, false)
})

menuScene.hears('🟢 Active Kusama', async (ctx) => {
	const crowdloanStatus = 'active'
	const relayChain = 'kusama'

	saveCrowdloanInfoToSessionStorage({
		ctx,
		onlyContributed: false,
		relayChain,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(ctx, relayChain, crowdloanStatus, false)
})

menuScene.action('next', async (ctx) => {
	const relayChain = ctx.session.relayChain
	const crowdloanStatus = ctx.session.crowdloanStatus
	const onlyContributed = ctx.session.onlyContributed

	ctx.session.page = ctx.session.page + 1

	await ctx.deleteMessage()
	await sendCrowdloansContributions(
		ctx,
		relayChain,
		crowdloanStatus,
		onlyContributed
	)
})

menuScene.action('winner', async (ctx) => {
	const crowdloanStatus = 'winner'
	const relayChain = ctx.session.relayChain
	const onlyContributed = ctx.session.onlyContributed

	ctx.session.crowdloanStatus = crowdloanStatus
	ctx.session.page = 1

	saveCrowdloanInfoToSessionStorage({
		ctx,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(
		ctx,
		relayChain,
		crowdloanStatus,
		onlyContributed
	)
})

menuScene.action('all', async (ctx) => {
	const crowdloanStatus = 'all'
	const relayChain = ctx.session.relayChain
	const onlyContributed = ctx.session.onlyContributed

	saveCrowdloanInfoToSessionStorage({
		ctx,
		crowdloanStatus,
		page: 1,
	})

	await sendCrowdloansContributions(
		ctx,
		relayChain,
		crowdloanStatus,
		onlyContributed
	)
})

menuScene.hears('🔑 Switch account', async (ctx) => {
	await ctx.scene.leave()
	await ctx.scene.enter(confirmAccountSceneName)
})
