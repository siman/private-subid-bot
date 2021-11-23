import { toShortMoney } from '../resolvers/utils'
import { DEFAULT_PAGE_SIZE } from '../utils/index'
import { resolveCrowdloansInfo } from '../resolvers/crowdloanInfoResolver'
import { CustomTelegrafContext } from '../types'
import { RelayChain, CrowdloanMessageInfo, Status } from '../utils/types'
import {
	ContributionInfo,
	contributionInfoByRelayChain,
	defaultContributionLink,
} from '../utils/links'
import { inlinePaginationButtons, menuKeyboard } from '../utils/buttons'

const getEmojiByStatus = (status: Status) => {
	switch (status) {
		case 'active':
			return '🟢'
		case 'winner':
			return '👑'
		case 'ended':
			return '🏁'
		default:
			return ''
	}
}

export const createCrowdloanMessage = ({
	name,
	status,
	balanceValue,
	raisedValue,
	capValue,
	raisedPercent,
	totalValue,
	symbol,
	contribLink,
	refBonus,
}: CrowdloanMessageInfo) => {
	const statusEmoji = getEmojiByStatus(status)

	const contributeLink = `<a href='${contribLink}'>Contribute ${
		refBonus ? `(${refBonus} bonus)` : ''
	}</a>`
	const statusValue = `<i>${status}</i>`
	const contributedEmoji = balanceValue.gt(0) ? '💰 ' : ''

	const header = `${statusEmoji} <b>${name}</b>  •  ${
		contribLink ? contributeLink : statusValue
	}\n\n`

	const contributedPart = `Contributed:\n${contributedEmoji}<b>${balanceValue}</b> ${symbol} ~= <b>${toShortMoney(
		{ num: totalValue.toNumber(), prefix: '$' }
	)}</b>\n\n`

	const raisedPart = `Raised ${raisedPercent.toFixed(2)}%:\n<b>${toShortMoney({
		num: raisedValue.toNumber(),
	})}</b> / <b>${toShortMoney({
		num: capValue.toNumber(),
	})}</b> ${symbol}`

	return header + contributedPart + raisedPart
}

export const sendCrowdloansContributions = async (
	ctx: CustomTelegrafContext,
	relayChain: RelayChain,
	status: string,
	onlyContributed: boolean
) => {
	const page = ctx.session.page || 1
	const address = ctx.session.address

	const start = (page - 1) * DEFAULT_PAGE_SIZE
	const end = start + DEFAULT_PAGE_SIZE

	const crowdloansInfo = await resolveCrowdloansInfo({
		relayChain,
		onlyContributed,
		address,
		page,
	})

	const crowdloansInfoByStatus: any[] = crowdloansInfo[status]

	const crowdloansInfoSlice = crowdloansInfoByStatus?.slice(start, end)

	const contribByRelayChain = contributionInfoByRelayChain[relayChain]

	for (const info of crowdloansInfoSlice) {
		const contribInfo: ContributionInfo = contribByRelayChain[info.key] || {}
		const { contribLink = defaultContributionLink[relayChain], refBonus = '' } =
			contribInfo

		const message = createCrowdloanMessage({
			contribLink: info.status === 'active' && contribLink,
			refBonus,
			...info,
		})

		await ctx.reply(message, {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
			reply_markup: menuKeyboard.reply_markup
		})
	}
	await sendPaginationMessage(ctx, crowdloansInfoByStatus.length, end)
}

const sendPaginationMessage = async (
	ctx: CustomTelegrafContext,
	crowdloansInfoLength: number,
	end: number
) => {
	if (crowdloansInfoLength > DEFAULT_PAGE_SIZE) {
		const buttons = inlinePaginationButtons(end >= crowdloansInfoLength)
		const currentCrowdloansLength =
			end > crowdloansInfoLength ? crowdloansInfoLength : end

		await ctx.reply(
			`${currentCrowdloansLength}/${crowdloansInfoLength} crowdloans`,
			buttons
		)
	} else {
		await ctx.reply('No more data', menuKeyboard)
	}
}
