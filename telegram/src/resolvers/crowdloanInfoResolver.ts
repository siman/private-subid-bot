import {
  CrowdloanInfo,
  CrowdloanMessageInfo,
  CrowdloansContributionsByParaId,
  RelayChain,
} from '../utils/types'
import { isEmptyArray, isDef } from '@subsocial/utils'
import BN from 'bignumber.js'
import {
  getBalances,
  getBalanceWithDecimals,
  startWithUpperCase,
} from './utils'
import { partition } from 'lodash'
import { ChainInfo, Status } from '../utils/types'
import { resolveChainsInfo } from './resolveChainInfo'
import {
  getCrowdloans,
  getCrowdloansInfoByRelayChain,
  getTokenPrice,
} from '../utils/offchainUtils'

type CrowdloansByStatus = Record<Status & 'all', CrowdloanMessageInfo[]>

type GetCrowdloanInfoProps = {
  relayChain: RelayChain,
  onlyContributed: boolean,
  address?: string,
}

type ResolveCrowdloanInfoProps = GetCrowdloanInfoProps & {
  page: number
}

let crowdloansInfo: CrowdloansByStatus

export const resolveCrowdloansInfo = async ({ page, ...otherProps }: ResolveCrowdloanInfoProps) => {
  if(!crowdloansInfo || page === 1) {
    crowdloansInfo = await getCrowdloansInfo(otherProps)
  }

  return crowdloansInfo
}

export const getCrowdloansInfo = async ({
  relayChain,
  onlyContributed,
  address
}: GetCrowdloanInfoProps) => {
  if (!address) return undefined

  const chainsInfo = await resolveChainsInfo()
  const crowdloans = await getCrowdloans({
    account: address.toString(),
    relayChain,
  })
  const crowdloansInfo = await getCrowdloansInfoByRelayChain(relayChain)
  const tokenPrice = await getTokenPrice(relayChain)

  return parseCrowdloansInfo(
    chainsInfo,
    tokenPrice,
    address,
    crowdloansInfo,
    relayChain,
    onlyContributed,
    crowdloans
  )
}

const getCrowdloanStatus = (
  isCapped: boolean,
  isWinner: boolean,
  isEnded: boolean
): Status => {
  if (isWinner) return 'winner'
  else if (isEnded || isCapped) return 'ended'
  else return 'active'
}

export const parseCrowdloansInfo = (
  chainsInfo: ChainInfo,
  tokenPrices: any,
  _address: string,
  crowdloansInfo: CrowdloanInfo[],
  relayChain: RelayChain,
  onlyContributed: boolean,
  balances?: CrowdloansContributionsByParaId
): CrowdloansByStatus => {
  const { tokenDecimals, tokenSymbol } = chainsInfo[relayChain]

  if (!balances) return []

  const decimals =
    tokenDecimals && !isEmptyArray(tokenDecimals) ? tokenDecimals[0] : 0

  const symbol = tokenSymbol && !isEmptyArray(tokenSymbol) ? tokenSymbol[0] : ''

  const crowdloans = crowdloansInfo
    .map((crowdloan) => {
      const { paraId, isCapped, isWinner, isEnded, raised, cap } = crowdloan
      const { contribution, network } = balances[paraId]
      const { icon, name } = chainsInfo[network]

      const { balanceValue, totalValue } = getBalances({
        totalBalance: contribution,
        decimals,
        symbol,
        tokenPrices,
        priceField: 'symbol',
        comparableValue: symbol,
      })

      if (onlyContributed && balanceValue.eq(0)) return undefined

      const raisedValue = getBalanceWithDecimals({
        totalBalance: new BN(raised).toString(),
        decimals,
      })
      const capValue = getBalanceWithDecimals({
        totalBalance: new BN(cap).toString(),
        decimals,
      })

      const raisedPercent = raisedValue
        .dividedBy(capValue)
        .multipliedBy(new BN(100))

      const status = getCrowdloanStatus(isCapped, isWinner, isEnded)

      return {
        key: network,
        name: startWithUpperCase(name),
        icon: icon,
        balanceValue,
        symbol,
        raisedValue,
        capValue,
        totalValue,
        status,
        raisedPercent,
      } as CrowdloanMessageInfo
    })
    .filter(isDef)

  const [activeCrowdloans, winnerCrowdloans] = partition(
    crowdloans,
    (x) => x.status === 'active'
  )

  const activeCrowdloansSorted = activeCrowdloans.sort((a, b) =>
    b.raisedValue.minus(a.raisedValue).toNumber()
  )

  const winnerCrowdloansSorted = winnerCrowdloans.sort(
    (a, b) =>
      b.balanceValue.minus(a.balanceValue).toNumber() ||
      b.raisedValue.minus(a.raisedValue).toNumber()
  )

  return {
    all: [...activeCrowdloansSorted, ...winnerCrowdloansSorted],
    active: activeCrowdloansSorted,
    winner: winnerCrowdloansSorted,
  }
}
