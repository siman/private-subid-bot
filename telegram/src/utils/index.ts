import registry from '@subsocial/types/substrate/registry'
import { GenericAccountId } from '@polkadot/types'
import { CustomTelegrafContext, SessionsArrayObject } from '../types'
import { confirmAccountSceneName } from '../scenes/AuthScene'
import { RelayChain } from './types';
import { readFileSync } from 'fs'

export const DEFAULT_PAGE_SIZE = 3

export const projectDirPath = `${__dirname}/../../..`
const sessionsFilePath = `${projectDirPath}/sessions.json`

export const supportedNetworks = [
  'polkadot',
  'kusama',
  'karura',
  'moonriver',
  'shiden',
  'khala',
  'bifrost',
  'statemine',
  'centrifuge',
  // 'hydra-dx',
  'sora',
  'edgeware',
  // 'equilibrium',
  // 'darwinia',
  'chainx',
  'subsocial'
]

export const isValidAccount = (address?: string) => {
  try {
    return address ? !!new GenericAccountId(registry, address) : false
  } catch {
    return false
  }
}

export const startBot = async (ctx: CustomTelegrafContext) => {
  await ctx.reply('Hi 👋 Welcome to the Sub.ID Telegram bot, where you can check crowdloan contribution details.')
  await ctx.scene.leave()
	await ctx.scene.enter(confirmAccountSceneName)
}


type CrowdloanInfoProps = {
	ctx: CustomTelegrafContext
	page?: number
	onlyContributed?: boolean
	crowdloanStatus?: string
	relayChain?: RelayChain
}

export const saveCrowdloanInfoToSessionStorage = ({
	ctx,
	relayChain,
	crowdloanStatus,
	page,
	onlyContributed,
}: CrowdloanInfoProps) => {
	onlyContributed !== undefined && (ctx.session.onlyContributed = onlyContributed)
	relayChain && (ctx.session.relayChain = relayChain)
	crowdloanStatus && (ctx.session.crowdloanStatus = crowdloanStatus)
	page && (ctx.session.page = page)
}

export const getChatIds = (): number[] => {
  const sessionsString = readFileSync(sessionsFilePath, 'utf-8')
  const { sessions } = JSON.parse(sessionsString) as SessionsArrayObject

  return sessions
    .map((value) => parseInt(value.id.split(':').pop()))
    .filter((value) => !isNaN(value))
}
