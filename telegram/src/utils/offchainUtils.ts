import { isDef } from '@subsocial/utils'
import axios from 'axios'
import { supportedNetworks } from './index'
import { backendUrl } from './env'
import { AccountInfoItem, RelayChain, CrowdloanInfo } from './types';

export function getBackendUrl(subUrl: string): string {
  return `${backendUrl}/api/v1/${subUrl}`
}

export const getAccountInfo = async (account: string) => {
  const promises = supportedNetworks.map(async (network) => {
    try {
      const { data: info, status } = await axios.get(
        getBackendUrl(`${account}/balances/${network}`)
      )
      if (status !== 200) {
        console.warn(`Failed to get balances by account: ${account}`)
        return undefined
      }
      return { network, info } as AccountInfoItem
    } catch (err) {
      console.error(
        `Failed to get balances from ${network} by account: ${account}`,
        err
      )
      return undefined
    }
  })

  const balances = await Promise.all(promises)

  return balances.filter(isDef)
}

export const getChainsInfo = async () => {
  try {
    const res = await axios.get(getBackendUrl('/chains/properties'))
    if (res.status !== 200) {
      console.warn('Failed to get chain info')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get chain info', err)
    return undefined
  }
}

export const getAccountIdentities = async (account: string) => {
  try {
    const res = await axios.get(getBackendUrl(`${account}/identities`))
    if (res.status !== 200) {
      console.warn('Failed to get identities info')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get identities info', err)
    return undefined
  }
}

export const getTokenPrice = async (chains: string) => {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${chains}`
    )
    if (res.status !== 200) {
      console.warn('Failed to get token price')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get token price', err)
    return undefined
  }
}

type GetCrowdloansProps = {
  account: string
  relayChain: RelayChain
}

export const getCrowdloans = async ({
                                      account,
                                      relayChain,
                                    }: GetCrowdloansProps) => {
  try {
    const res = await axios.get(
      getBackendUrl(`crowdloans/contributions/${relayChain}/${account}`)
    )

    if (res.status !== 200) {
      console.warn('Failed to get crowdloans')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get crowdloans', err)
    return undefined
  }
}

export const getCrowdloansInfoByRelayChain = async (
  relayChain: RelayChain
): Promise<CrowdloanInfo[]> => {
  try {
    const res = await axios.get(getBackendUrl(`crowdloans/${relayChain}`))

    if (res.status !== 200) {
      console.warn('Failed to get crowdloans info by relay chain', relayChain)
    }

    return (res.data || []).filter(isDef)
  } catch (err) {
    console.error(
      'Failed to get crowdloans info by relay chain',
      relayChain,
      err
    )
    return []
  }
}

export const getNtfsByAccount = async (account: string) => {
  try {
    const res = await axios.get(getBackendUrl(`${account}/nfts`))
    if (res.status !== 200) {
      console.warn('Failed to get chain info')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get chain info', err)
    return undefined
  }
}

export const getAssets = async () => {
  try {
    const res = await axios.get(getBackendUrl('statemine/assets'))
    if (res.status !== 200) {
      console.warn('Failed to get assets')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get assets', err)
    return undefined
  }
}

export const getAssetsBalancesByAccount = async (account: string) => {
  try {
    const res = await axios.get(getBackendUrl(`statemine/assets/${account}`))
    if (res.status !== 200) {
      console.warn('Failed to get assets balances by account')
    }

    return res.data
  } catch (err) {
    console.error('Failed to get assets balances by account', err)
    return undefined
  }
}
