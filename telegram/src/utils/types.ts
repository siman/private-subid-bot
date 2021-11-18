import { ProfileData } from '@subsocial/types'
import BN from 'bignumber.js'

export type RelayChain = 'polkadot' | 'kusama'

export type Info = {
  display: string
  legal: string
  web: string
  riot: string
  email: string
  twitter: string
}

export type InfoKeys = keyof Info

export const identityInfoKeys: InfoKeys[] = ['display', 'legal', 'web', 'riot', 'email', 'twitter']

export type AccountInfoByChain = {
  accountId: string
  totalBalance: string
  freeBalance: string
  frozenFee: string
  reservedBalance: string
  frozenMisc: string
}

export type AccountInfoItem = {
  network: string
  info: Record<string, AccountInfoByChain>
}

export type AccountInfo = AccountInfoItem[]

export type CrowdloansContributions = {
  network: string
  contribution: string
}

export type CrowdloansContributionsByParaId = Record<string, CrowdloansContributions>

export type CrowdloanInfo = {
  depositor: string
  verifier: null
  deposit: BN
  raised: string
  end: BN
  cap: string
  firstPeriod: number
  lastPeriod: number
  trieIndex: number
  isCapped: boolean
  isEnded: boolean
  isWinner: boolean
  paraId: number
}

export type IdentityInfo = {
  [key: string]: string
}

export type Identity = {
  info: IdentityInfo
  isVerify: boolean
}

export type AccountIdentity = {
  [key: string]: ProfileData | Identity
}

export type Status = 'active' | 'winner' | 'ended'

export type ChainInfo = {
  ss58Format: number
  tokenDecimals?: number[]
  tokenSymbol: string[]
  icon: string
  name: string
}

export type ChainInfoByKey = {
  [key: string]: Info
}

export type CrowdloanMessageInfo = {
	name: string
	status: Status
	balanceValue: BN
	raisedValue: BN
	capValue: BN
	raisedPercent: BN
	totalValue: BN
	symbol: string
	contribLink?: string
	refBonus?: string
}