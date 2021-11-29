import { Scenes, Markup } from 'telegraf'
import { CustomTelegrafContext, AdminPanelSceneState } from '../types'
import { getChatIds, startBot } from '../utils/index'
import { adminsArray } from '../utils/env'
import { menuSceneName } from './MenuScene'
import { checkNetworks } from '../jobs'

export const adminPanelSceneName = 'AdminPanel'

export const adminPanelScene = new Scenes.BaseScene<CustomTelegrafContext>(
	adminPanelSceneName
)

const contactRequestKeyboard = Markup.keyboard([
	Markup.button.contactRequest('📖 I solemnly swear that i am up to no good!'),
]).resize()

const keyboard = Markup.keyboard([
	[
		{ text: '📢 Send announcement', hide: false },
		{ text: '📊 Statistics', hide: false },
	],
	[{ text: '❌ Disconnected networks', hide: false }],
	[{ text: '📘 Mischief managed', hide: false }],
]).resize()

// TODO: restrict to user ids.
//  - Phone number may be way too confidential to store it on external server.
adminPanelScene.enter((ctx) => {
	ctx.reply('🤔 Are you really an administrator?', contactRequestKeyboard)
})

adminPanelScene.command('start', async (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state

	ctx.scene.state = {
		...sceneState,
		isAnnouncementMode: false,
		announcementMessage: null,
		photo: null,
	}

	await startBot(ctx)
})

adminPanelScene.on('contact', (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	const address = ctx.session.address
	if (sceneState.adminConfirmed) return undefined

	const isAdmin = adminsArray.includes(ctx.from.id.toString())

	if (!ctx.message.reply_to_message || !isAdmin) {
		ctx.reply(`Nice try, but not today`)

		ctx.scene.leave()
		if (address) {
			ctx.scene.enter(menuSceneName)
		}
		return
	}

	ctx.scene.state = { adminConfirmed: true }
	ctx.reply('🥳 Yes, you are administrator)', keyboard)
	return undefined
})

adminPanelScene.hears('📢 Send announcement', (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed) return

	ctx.scene.state = {
		...sceneState,
		isAnnouncementMode: true,
	}
	ctx.reply('Okay, your next post will be treated as an announcement:')
})

adminPanelScene.hears('❌ Disconnected networks', (ctx) => {
	checkNetworks([ctx.from.id.toString()])
})

adminPanelScene.hears('📊 Statistics', (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed) return

	const totalUsersCount = getChatIds().length

	ctx.scene.state = {
		...sceneState,
	}

	ctx.reply(`📊 Statistics\n\nTotal users count: ${totalUsersCount}`, keyboard)
})

adminPanelScene.hears('📘 Mischief managed', (ctx) => {
	const address = ctx.session.address

	ctx.reply('😉')

	ctx.scene.leave()

	if (address) {
		ctx.scene.enter(menuSceneName)
	}
})

adminPanelScene.hears('👌 Yes', async (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed || !sceneState.isAnnouncementMode) return

	const announcementMessage = sceneState.announcementMessage
	const photo = sceneState.photo
	ctx.scene.state = {
		...sceneState,
		isAnnouncementMode: false,
		announcementMessage: null,
		photo: null,
	}

	await ctx.reply('I read registered users and create messages...')

	const chatIds = getChatIds()
	const promises = chatIds.map(async (value) => {
		if (photo) {
			await ctx.telegram.sendPhoto(value, photo, {
				caption: announcementMessage,
				parse_mode: 'HTML',
			})
		} else {
			await ctx.telegram.sendMessage(value, announcementMessage, {
				parse_mode: 'HTML',
			})
		}
	})

	await Promise.allSettled(promises)

	ctx.reply('Done, I sent a message to all users 😉', keyboard)
})

adminPanelScene.hears('⛔ No', (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed || !sceneState.isAnnouncementMode) return

	ctx.scene.state = {
		...sceneState,
		isAnnouncementMode: false,
		announcementMessage: null,
	}
	ctx.reply('Ok, fix it :)', keyboard)
})

adminPanelScene.on('photo', async (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed || !sceneState.isAnnouncementMode) return

	const { caption, caption_entities, photo } = ctx.message

	const htmlText = parseTextToHtml(caption_entities, caption)

	const fileId = photo.pop().file_id

	ctx.scene.state = {
		...sceneState,
		announcementMessage: htmlText,
		photo: fileId,
	}

	await ctx.reply('So, your message:')
	await ctx.replyWithPhoto(fileId, {
		caption: htmlText,
		parse_mode: 'HTML',
	})

	await sendMessageButtons(ctx)
})

adminPanelScene.on('text', async (ctx) => {
	const sceneState: AdminPanelSceneState = ctx.scene.state
	if (!sceneState.adminConfirmed || !sceneState.isAnnouncementMode) return

	const { entities, text } = ctx.message

	const htmlText = parseTextToHtml(entities, text)

	ctx.scene.state = {
		...sceneState,
		announcementMessage: htmlText,
	}

	await ctx.reply('So, your message:')
	await ctx.reply(htmlText, { parse_mode: 'HTML' })

	await sendMessageButtons(ctx)
})

const sendMessageButtons = async (ctx: CustomTelegrafContext) => {
	await ctx.reply(
		'Send?',
		Markup.keyboard([
			{ text: '👌 Yes', hide: false },
			{ text: '⛔ No', hide: false },
		]).resize()
	)
}

const parseTextToHtml = (entities: any[], text: string) => {
	let htmlText = text

	entities?.map((item) => {
		const { offset, length, type } = item

		const limit = offset + length
		const textPart = text.slice(offset, limit)

		let formattedMessage = ''

		switch (type) {
			case 'bold': {
				formattedMessage = `<b>${textPart}</b>`
				break
			}
			case 'italic': {
				formattedMessage = `<i>${textPart}</i>`
				break
			}
			case 'code': {
				formattedMessage = `<code>${textPart}</code>`
				break
			}
			case 'strikethrough': {
				formattedMessage = `<s>${textPart}</s>`
				break
			}
			case 'underline': {
				formattedMessage = `<u>${textPart}</u>`
				break
			}
			case 'text_link': {
				formattedMessage = `<a href='${item.url}'>${textPart}</a>`
				break
			}
		}

		htmlText = htmlText.replace(textPart, formattedMessage)
	})

	return htmlText
}
